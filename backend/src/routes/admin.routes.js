import express from 'express';

import {
    adminController,
} from '../controllers/admin/admin.controller.js';

const router = express.Router();

/**
 * Check admin authentication for API endpoints.
 */
function requireAdminApi(req, res, next) {
    if (!req.session?.adminAuthenticated) {
        return res.status(401).json({
            success: false,
            message: 'Admin authentication required',
        });
    }

    next();
}

/**
 * =========================
 * Authentication
 * =========================
 */

/**
 * POST /admin/login
 *
 * Public.
 *
 * Used by React AdminLogin.
 */
router.post(
    '/login',
    adminController.login
);

/**
 * POST /admin/logout
 *
 * Protected.
 */
router.post(
    '/logout',
    requireAdminApi,
    adminController.logout
);

/**
 * GET /admin/api/session
 *
 * Check whether current session
 * is authenticated as admin.
 *
 * This endpoint is public because
 * unauthenticated users need to be
 * able to check their session.
 */
router.get(
    '/api/session',
    adminController.session
);

/**
 * =========================
 * Admin APIs
 * =========================
 */

/**
 * GET /admin/api/health
 *
 * Protected.
 */
router.get(
    '/api/health',
    requireAdminApi,
    adminController.health
);

/**
 * GET /admin/api/stats
 *
 * Protected.
 */
router.get(
    '/api/stats',
    requireAdminApi,
    adminController.dashboard
);

export default router;