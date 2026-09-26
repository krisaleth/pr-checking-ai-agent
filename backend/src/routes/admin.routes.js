import express from 'express';

import {
    adminController,
} from '../controllers/admin/admin.controller.js';

const router = express.Router();

function requireAdmin(req, res, next) {
    if (!req.session.adminAuthenticated) {
        return res.redirect('/admin/login');
    }

    next();
}

/**
 * Public
 */
router.get(
    '/login',
    adminController.showLogin
);

router.post(
    '/login',
    adminController.login
);

/**
 * Protected
 */
router.post(
    '/logout',
    requireAdmin,
    adminController.logout
);

router.get(
    '/',
    requireAdmin,
    adminController.showDashboard
);

router.get(
    '/api/health',
    requireAdmin,
    adminController.health
);

router.get(
    '/api/stats',
    requireAdmin,
    adminController.dashboard
);

export default router;