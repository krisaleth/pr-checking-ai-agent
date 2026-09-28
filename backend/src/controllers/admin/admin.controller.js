import crypto from 'crypto';

import Repository from '../../models/repository.model.js';
import PullRequest from '../../models/pull-request.model.js';
import Review from '../../models/review.model.js';
import WebhookDelivery from '../../models/webhook-delivery.model.js';

function safeEqual(a, b) {
    const aBuffer = Buffer.from(String(a ?? ''));
    const bBuffer = Buffer.from(String(b ?? ''));

    if (aBuffer.length !== bBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        aBuffer,
        bBuffer
    );
}

export const adminController = {

    /**
     * POST /admin/login
     *
     * Admin login API.
     */
    async login(req, res) {
        try {
            const {
                username,
                password,
            } = req.body || {};

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Username and password are required',
                });
            }

            const configuredUsername =
                process.env.ADMIN_USERNAME;

            const configuredPassword =
                process.env.ADMIN_PASSWORD;

            if (
                !configuredUsername ||
                !configuredPassword
            ) {
                console.error(
                    '[Admin] ADMIN_USERNAME or ADMIN_PASSWORD is not configured'
                );

                return res.status(500).json({
                    success: false,
                    message:
                        'Admin authentication is not configured',
                });
            }

            const validUsername = safeEqual(
                username,
                configuredUsername
            );

            const validPassword = safeEqual(
                password,
                configuredPassword
            );

            if (!validUsername || !validPassword) {
                return res.status(401).json({
                    success: false,
                    message:
                        'Invalid username or password',
                });
            }

            /*
             * Authentication successful.
             */
            req.session.adminAuthenticated = true;

            return res.status(200).json({
                success: true,
                message:
                    'Admin login successful',
            });
        } catch (error) {
            console.error(
                '[Admin] Login error:',
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    'Internal server error',
            });
        }
    },

    /**
     * POST /admin/logout
     *
     * Destroy admin session.
     */
    logout(req, res) {
        req.session.destroy((error) => {
            if (error) {
                console.error(
                    '[Admin] Logout error:',
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: 'Logout failed',
                });
            }

            res.clearCookie('connect.sid');

            return res.status(200).json({
                success: true,
                message:
                    'Admin logout successful',
            });
        });
    },

    /**
     * GET /admin/api/session
     *
     * Check current admin session.
     */
    session(req, res) {
        const authenticated =
            req.session?.adminAuthenticated === true;

        if (!authenticated) {
            return res.status(401).json({
                success: false,
                authenticated: false,
                message:
                    'Admin authentication required',
            });
        }

        return res.status(200).json({
            success: true,
            authenticated: true,
        });
    },

    /**
     * GET /admin/api/health
     *
     * Admin system health.
     */
    async health(req, res) {
        const startedAt = process.uptime();

        const health = {
            server: {
                status: 'online',
                uptime: startedAt,
                timestamp:
                    new Date().toISOString(),
            },

            database: {
                status: 'unknown',
            },

            ai: {
                status: 'unknown',
            },

            github: {
                status: 'unknown',
            },
        };

        /*
         * Database
         */
        try {
            await Repository.exists({});

            health.database.status =
                'connected';
        } catch (error) {
            console.error(
                '[Admin] Health database error:',
                error
            );

            health.database.status =
                'disconnected';
        }

        /*
         * AI
         */
        health.ai.status =
            process.env.OPENAI_ADMIN_KEY
                ? 'configured'
                : 'not_configured';

        /*
         * GitHub App
         */
        health.github.status =
            process.env.GITHUB_APP_ID &&
            process.env.GITHUB_APP_PRIVATE_KEY_PATH
                ? 'configured'
                : 'not_configured';

        const allReady =
            health.server.status ===
                'online' &&
            health.database.status ===
                'connected' &&
            health.ai.status ===
                'configured' &&
            health.github.status ===
                'configured';

        return res
            .status(allReady ? 200 : 503)
            .json({
                success: allReady,
                health,
            });
    },

    /**
     * GET /admin/api/stats
     *
     * Admin dashboard statistics.
     */
    async dashboard(req, res) {
        try {
            const [
                repositories,
                pullRequests,
                reviews,
                webhooks,
                completed,
                running,
                queued,
                failed,
                recentReviews,
                recentWebhooks,
            ] = await Promise.all([
                /*
                 * Total repositories
                 */
                Repository.countDocuments(),

                /*
                 * Total pull requests
                 */
                PullRequest.countDocuments(),

                /*
                 * Total reviews
                 */
                Review.countDocuments(),

                /*
                 * Total webhook deliveries
                 */
                WebhookDelivery.countDocuments(),

                /*
                 * Completed reviews
                 */
                Review.countDocuments({
                    status: 'completed',
                }),

                /*
                 * Running reviews
                 */
                Review.countDocuments({
                    status: 'running',
                }),

                /*
                 * Queued reviews
                 */
                Review.countDocuments({
                    status: 'queued',
                }),

                /*
                 * Failed reviews
                 */
                Review.countDocuments({
                    status: 'failed',
                }),

                /*
                 * Recent reviews
                 */
                Review.find()
                    .sort({
                        createdAt: -1,
                    })
                    .limit(10)
                    .populate({
                        path: 'pullRequestId',
                        populate: {
                            path: 'repositoryId',
                        },
                    })
                    .lean(),

                /*
                 * Recent webhooks
                 */
                WebhookDelivery.find()
                    .sort({
                        receivedAt: -1,
                        createdAt: -1,
                    })
                    .limit(10)
                    .populate('repositoryId')
                    .lean(),
            ]);

            /*
             * Unified activity feed.
             */
            const activities = [
                /*
                 * Webhook activities
                 */
                ...recentWebhooks.map(
                    (webhook) => ({
                        type: 'webhook',

                        createdAt:
                            webhook.receivedAt ||
                            webhook.createdAt,

                        status:
                            webhook.status,

                        event:
                            webhook.event,

                        action:
                            webhook.action,

                        repository:
                            webhook.repositoryId
                                ? {
                                      name:
                                          webhook
                                              .repositoryId
                                              .name,

                                      fullName:
                                          webhook
                                              .repositoryId
                                              .fullName,
                                  }
                                : null,

                        pullRequestNumber:
                            webhook.pullRequestNumber ??
                            null,
                    })
                ),

                /*
                 * Review activities
                 */
                ...recentReviews.map(
                    (review) => ({
                        type: 'review',

                        createdAt:
                            review.createdAt,

                        status:
                            review.status,

                        reviewId:
                            review._id,

                        pullRequest:
                            review.pullRequestId
                                ? {
                                      number:
                                          review
                                              .pullRequestId
                                              .githubPrNumber ??
                                          null,

                                      githubPrNumber:
                                          review
                                              .pullRequestId
                                              .githubPrNumber ??
                                          null,

                                      title:
                                          review
                                              .pullRequestId
                                              .title ??
                                          null,

                                      repository:
                                          review
                                              .pullRequestId
                                              .repositoryId
                                              ? {
                                                    name:
                                                        review
                                                            .pullRequestId
                                                            .repositoryId
                                                            .name,

                                                    fullName:
                                                        review
                                                            .pullRequestId
                                                            .repositoryId
                                                            .fullName,
                                                }
                                              : null,
                                  }
                                : null,
                    })
                ),
            ]
                .sort(
                    (a, b) =>
                        new Date(
                            b.createdAt
                        ) -
                        new Date(
                            a.createdAt
                        )
                )
                .slice(0, 15);

            return res.status(200).json({
                success: true,

                stats: {
                    repositories,
                    pullRequests,
                    reviews,
                    webhooks,
                    completed,
                    running,
                    queued,
                    failed,
                },

                recentReviews,

                recentWebhooks,

                activities,
            });
        } catch (error) {
            console.error(
                '[Admin] Dashboard error:',
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    'Failed to load dashboard',
            });
        }
    },
};