import Review from '../models/review.model.js';
import PullRequest from '../models/pull-request.model.js';
import Repository from '../models/repository.model.js';
import ReviewFinding from '../models/review-finding.model.js';
import { createPullRequestReview } from './github-review.service.js';
import WebhookDelivery from '../models/webhook-delivery.model.js';

import { reviewPullRequest } from './pr-review.service.js';

export async function processReview(reviewId, webhookDeliveryId) {
    if (!reviewId) {
        throw new Error('reviewId is required');
    }

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new Error(`Review not found: ${reviewId}`);
    }

    if (review.status !== 'queued') {
        console.log(
            `[Review Job] Review ${reviewId} is not queued. ` +
            `Current status: ${review.status}`
        );

        return review;
    }

    const pullRequest = await PullRequest.findById(
        review.pullRequestId
    );

    if (!pullRequest) {
        throw new Error(
            `Pull Request not found: ${review.pullRequestId}`
        );
    }

    const repository = await Repository.findById(
        pullRequest.repositoryId
    );

    if (!repository) {
        throw new Error(
            `Repository not found: ${pullRequest.repositoryId}`
        );
    }

    const claimedReview = await Review.findOneAndUpdate(
        {
            _id: reviewId,
            status: 'queued',
        },
        {
            $set: {
                status: 'running',
                startedAt: new Date(),
            },
        },
        {
            returnDocument: 'after',
        }
    );

    if (!claimedReview) {
        console.log(
            `[Review Job] Review ${reviewId} was already claimed`
        );
        return await Review.findById(reviewId);
    }

    console.log(
        `[Review Job] Review ${reviewId} is now running`
    );

    try {
        const result = await reviewPullRequest({
            owner: repository.owner,
            repo: repository.name,
            pullNumber: pullRequest.githubPrNumber,
            installationId: repository.installationId,
        });

        const allFindings = [
            ...(result.findings || []).map((finding) => ({
                ...finding,
                mapped: true,
            })),

            ...(result.unmapped_findings || []).map((finding) => ({
                ...finding,
                mapped: false,
            })),
        ];

        console.log(
            `[Review Job] Saving ${allFindings.length} findings`
        );

        await ReviewFinding.deleteMany({
            reviewId: claimedReview._id,
        });

        if (allFindings.length > 0) {
            await ReviewFinding.insertMany(
                allFindings.map((finding) => ({
                    reviewId: claimedReview._id,
                    file: finding.file,
                    line: finding.line ?? null,
                    side: finding.side ?? 'RIGHT',
                    severity: finding.severity,
                    confidence: finding.confidence,
                    title: finding.title,
                    explanation: finding.explanation,
                    suggestedFix: finding.suggested_fix ?? null,
                    needsFullFile: finding.needs_full_file ?? false,
                    mapped: finding.mapped,
                    postedToGithub: false,
                    githubCommentId: null,
                }))
            );
            const mappedFindings = await ReviewFinding.find({
                reviewId: claimedReview._id,
                mapped: true,
                postedToGithub: false,
            });

            if (mappedFindings.length > 0) {
                console.log(
                    `[Review Job] Posting ${mappedFindings.length} findings to GitHub`
                );

                const githubReview = await createPullRequestReview({
                    owner: repository.owner,
                    repo: repository.name,
                    pullNumber: pullRequest.githubPrNumber,
                    installationId: repository.installationId,
                    commitId: pullRequest.headSha,
                    findings: mappedFindings.map((finding) => ({
                        file: finding.file,
                        line: finding.line,
                        side: finding.side,
                        severity: finding.severity,
                        confidence: finding.confidence,
                        title: finding.title,
                        explanation: finding.explanation,
                        suggested_fix: finding.suggestedFix,
                    })),
                });

                if (githubReview) {
                    await ReviewFinding.updateMany(
                        {
                            reviewId: claimedReview._id,
                            mapped: true,
                            postedToGithub: false,
                        },
                        {
                            $set: {
                                postedToGithub: true,
                            },
                        }
                    );

                    claimedReview.githubReviewId = githubReview.id;
                }
            }
        }

        claimedReview.model = 'dots-studio/dots-3-note-preview:free';

        claimedReview.summary = result.summary || '';

        claimedReview.rawAiResponse = result;

        claimedReview.findingsCount = (result.findings?.length || 0) + (result.unmapped_findings?.length || 0);

        claimedReview.mappedFindingsCount =
            result.findings?.length || 0;

        claimedReview.unmappedFindingsCount =
            result.unmapped_findings?.length || 0;

        claimedReview.status = 'completed';
        claimedReview.completedAt = new Date();

        await claimedReview.save();

        if (webhookDeliveryId) {
            await WebhookDelivery.findByIdAndUpdate(
                webhookDeliveryId,
                {
                    status: 'processed',
                    processedAt: new Date(),
                }
            );
        }

        console.log(
            `[Review Job] Review ${reviewId} completed`
        );

        return claimedReview;

    } catch (error) {
        claimedReview.status = 'failed';
        claimedReview.errorMessage = error.message;
        claimedReview.completedAt = new Date();
        await claimedReview.save();

        if (webhookDeliveryId) {
            await WebhookDelivery.findByIdAndUpdate(
                webhookDeliveryId,
                {
                    status: 'failed',
                    errorMessage: error.message,
                    processedAt: new Date(),
                }
            );
        }

        console.error(
            `[Review Job] Review ${reviewId} failed:`,
            error.message
        );

        throw error;
    }
}