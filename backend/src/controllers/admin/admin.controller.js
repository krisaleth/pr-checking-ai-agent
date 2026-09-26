import crypto from 'crypto';

import Repository from '../../models/repository.model.js';
import PullRequest from '../../models/pull-request.model.js';
import Review from '../../models/review.model.js';
import WebhookDelivery from '../../models/webhook-delivery.model.js';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DASHBOARD_HTML_PATH =
    path.join(
        __dirname,
        '../../views/admin/dashboard.html'
    );

const LOGIN_HTML_PATH =
    path.join(
        __dirname,
        '../../views/admin/login.html'
    );

function safeEqual(a, b) {
    const aBuffer = Buffer.from(a || '');
    const bBuffer = Buffer.from(b || '');

    if (aBuffer.length !== bBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        aBuffer,
        bBuffer
    );
}

export const adminController = {

    async showLogin(req, res) {
        if (req.session.adminAuthenticated) {
            return res.redirect('/admin');
        }

        const html = await fs.readFile(
                LOGIN_HTML_PATH,
                'utf8'
            );

        return res.send(html);
    },

    async login(req, res) {
        const {
            username,
            password,
        } = req.body;

        const validUsername = safeEqual(
            username,
            process.env.ADMIN_USERNAME
        );

        const validPassword = safeEqual(
            password,
            process.env.ADMIN_PASSWORD
        );

        if (!validUsername || !validPassword) {
            const html = await fs.readFile(
                LOGIN_HTML_PATH,
                'utf8'
            );

            return res.status(401).send(
                html.replace(
                    '<!--ERROR-->',
                    '<div class="error">Invalid username or password</div>'
                )
            );

        }

        req.session.adminAuthenticated = true;

        return res.redirect('/admin');
    },

    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/admin/login');
        });
    },

    async health(req, res) {
        const startedAt = process.uptime();

        const health = {
            server: {
                status: 'online',
                uptime: startedAt,
                timestamp: new Date().toISOString(),
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

        try {
            await Repository.exists({});

            health.database.status = 'connected';
        } catch (error) {

            console.error(
                '[Admin] Health database error:',
                error
            );

            health.database.status = 'disconnected';
        }

        health.ai.status =
            process.env.OPENAI_ADMIN_KEY
                ? 'configured'
                : 'not_configured';

        health.github.status =
            process.env.GITHUB_APP_ID &&
            process.env.GITHUB_APP_PRIVATE_KEY_PATH
                ? 'configured'
                : 'not_configured';

        const allReady =
            health.server.status === 'online' &&
            health.database.status === 'connected' &&
            health.ai.status === 'configured' &&
            health.github.status === 'configured';

        return res.status(allReady ? 200 : 503).json({
            success: allReady,
            health,
        });
    },

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
                Repository.countDocuments(),

                PullRequest.countDocuments(),

                Review.countDocuments(),

                WebhookDelivery.countDocuments(),

                Review.countDocuments({
                    status: 'completed',
                }),

                Review.countDocuments({
                    status: 'running',
                }),

                Review.countDocuments({
                    status: 'queued',
                }),

                Review.countDocuments({
                    status: 'failed',
                }),

                Review.find()
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .populate({
                        path: 'pullRequestId',
                        populate: {
                            path: 'repositoryId',
                        },
                    })
                    .lean(),

                WebhookDelivery.find()
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .populate('repositoryId')
                    .lean(),
            ]);

            return res.json({
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
            });

        } catch (error) {

            console.error(
                '[Admin] Dashboard error:',
                error
            );

            return res.status(500).json({
                success: false,
                error: 'Failed to load dashboard',
            });
        }
    },

    async showDashboard(req, res) {
        const html = await fs.readFile(
            DASHBOARD_HTML_PATH,
            'utf8'
        );

        return res.send(html);
    }
};