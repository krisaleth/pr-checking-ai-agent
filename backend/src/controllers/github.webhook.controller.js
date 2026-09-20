import crypto from 'crypto';
import PullRequest from '../models/pull-request.model.js';
import WebhookDelivery from '../models/webhook-delivery.model.js';
import Repository from '../models/repository.model.js';
import Review from '../models/review.model.js';
import { processReview } from '../services/review-job.service.js';

const WEBHOOK_SECRET = process.env.GITHUB_APP_WEBHOOK_SECRET;

function verifySignature(rawBody, signature) {
    if (!WEBHOOK_SECRET || !signature) {
        return false;
    }

    const expectedSignature =
        'sha256=' +
        crypto
            .createHmac('sha256', WEBHOOK_SECRET)
            .update(rawBody)
            .digest('hex');

    const expected = Buffer.from(expectedSignature);
    const actual = Buffer.from(signature);

    if (expected.length !== actual.length) {
        return false;
    }

    return crypto.timingSafeEqual(expected, actual);
}

export const githubWebhookController = {

    async handle(req, res) {

        const signature =
            req.get('X-Hub-Signature-256');

        const event =
            req.get('X-GitHub-Event');

        const deliveryId =
            req.get('X-GitHub-Delivery');

        // req.body must still be the raw Buffer here
        if (!verifySignature(req.body, signature)) {

            console.warn(
                'Invalid GitHub webhook signature'
            );

            return res.status(401).json({
                error: 'Invalid webhook signature',
            });
        }

        let payload;

        try {

            payload = JSON.parse(
                req.body.toString('utf8')
            );

        } catch (err) {

            console.error(
                'Invalid GitHub webhook JSON:',
                err
            );

            return res.status(400).json({
                error: 'Invalid JSON payload',
            });
        }

        console.log('--- GitHub Webhook ---');
        console.log('Event:', event);
        console.log('Delivery:', deliveryId);

        // GitHub sends this when the webhook is created/updated
        if (event === 'ping') {

            console.log(
                'GitHub webhook ping received'
            );

            return res.status(200).json({
                message: 'pong',
            });
        }

        if (event === 'pull_request') {

            const repository =
                payload.repository?.full_name;

            const githubRepoId =
                payload.repository?.id;

            const owner =
                payload.repository?.owner?.login;

            const name =
                payload.repository?.name;

            const fullName =
                payload.repository?.full_name;

            const action =
                payload.action;

            const prNumber =
                payload.number;

            const headSha =
                payload.pull_request?.head?.sha;

            const installationId =
                payload.installation?.id;

            console.log(
                'Repository:',
                repository
            );

            console.log(
                'PR:',
                prNumber
            );

            console.log(
                'Action:',
                action
            );

            console.log(
                'Head SHA:',
                headSha
            );

            console.log(
                'Installation ID:',
                installationId
            );

            /*
             * Prevent duplicate webhook processing.
             */
            if (!deliveryId) {

                console.warn(
                    'Missing GitHub delivery ID'
                );

                return res.status(400).json({
                    error: 'Missing GitHub delivery ID',
                });
            }

            const existingDelivery =
                await WebhookDelivery.findOne({
                    githubDeliveryId: deliveryId,
                });

            if (existingDelivery) {
                console.log(
                    '[Webhook] Duplicate delivery:',
                    deliveryId
                );

                return res.status(200).json({
                    received: true,
                    duplicate: true,
                });
            }

            /*
             * Create or update Repository.
             */
            const repositoryDocument = await Repository.findOneAndUpdate(
                {
                    githubRepoId,
                },
                {
                    githubRepoId,
                    owner,
                    name,
                    fullName,
                    installationId: String(
                        installationId
                    ),
                },
                {
                    returnDocument: 'after',
                    upsert: true,
                }
            );

            console.log(
                '[Webhook] Repository:',
                repositoryDocument._id
            );

            const pullRequestDocument = await PullRequest.findOneAndUpdate(
                {
                    repositoryId: repositoryDocument._id,
                    githubPrNumber: prNumber,
                },
                {
                    repositoryId: repositoryDocument._id,
                    githubPrNumber: prNumber,

                    title:
                        payload.pull_request?.title || '',

                    authorGithubId:
                        payload.pull_request?.user?.id || null,

                    headSha,

                    baseSha:
                        payload.pull_request?.base?.sha || null,

                    state:
                        payload.pull_request?.state || 'open',
                },
                {
                    returnDocument: 'after',
                    upsert: true,
                }
            );

            console.log(
                '[Webhook] Pull Request:',
                pullRequestDocument._id
            );

            /*
             * Store webhook delivery.
             */
            const webhookDelivery = await WebhookDelivery.create({
                githubDeliveryId: deliveryId,
                event,
                action,
                repositoryId:
                    repositoryDocument._id,
                pullRequestNumber: prNumber,
                headSha,
                status: 'received',
            });

            console.log(
                '[Webhook] Delivery stored:',
                deliveryId
            );

            const shouldReview = [
                'opened',
                'synchronize',
                'reopened',
            ].includes(action);

            if (!shouldReview) {
                return res.status(200).json({
                    received: true,
                    review: false,
                });
            }

            let reviewDocument = await Review.findOne({
                pullRequestId: pullRequestDocument._id,
                headSha,
            });

            if (reviewDocument) {
                console.log(
                    `[Webhook] Review already exists: ${reviewDocument._id} ` +
                    `(status: ${reviewDocument.status})`
                );
            } else {
                try {
                    reviewDocument = await Review.create({
                        pullRequestId: pullRequestDocument._id,
                        headSha,
                        status: 'queued',
                    });

                    console.log(
                        '[Webhook] Review queued:',
                        reviewDocument._id
                    );
                } catch (error) {
                    if (error?.code !== 11000) {
                        throw error;
                    }

                    console.log(
                        '[Webhook] Review was created concurrently. ' +
                        'Loading existing review.'
                    );

                    reviewDocument = await Review.findOne({
                        pullRequestId: pullRequestDocument._id,
                        headSha,
                    });

                    if (!reviewDocument) {
                        throw new Error(
                            'Review creation raced with another request, ' +
                            'but the existing review could not be found'
                        );
                    }

                    console.log(
                        `[Webhook] Existing review loaded: ${reviewDocument._id} ` +
                        `(status: ${reviewDocument.status})`
                    );
                }
            }

            if (
                reviewDocument.status === 'queued' ||
                reviewDocument.status === 'failed'
            ) {
                if (reviewDocument.status === 'failed') {
                    console.log(
                        `[Webhook] Retrying failed review: ${reviewDocument._id}`
                    );

                    reviewDocument.status = 'queued';
                    reviewDocument.errorMessage = null;
                    reviewDocument.startedAt = null;
                    reviewDocument.completedAt = null;

                    await reviewDocument.save();
                }

                webhookDelivery.status = 'processing';
                await webhookDelivery.save();

                processReview(
                    reviewDocument._id.toString(),
                    webhookDelivery._id.toString()
                ).catch((error) => {
                    console.error(
                        `[Webhook] Review ${reviewDocument._id} failed:`,
                        error.message
                    );
                });

                return res.status(200).json({
                    received: true,
                    review: true,
                    reviewId: reviewDocument._id,
                });
            }
        }

        console.log(
            'Unhandled GitHub event:',
            event
        );

        return res.status(200).json({
            received: true,
        });
    },
};