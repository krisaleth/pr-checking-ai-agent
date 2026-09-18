import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();   

router.get('/github', authController.redirectToGithub);
router.get('/github/callback', authController.githubCallback);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.post('/logout-all', requireAuth, authController.logoutAll);

export default router;