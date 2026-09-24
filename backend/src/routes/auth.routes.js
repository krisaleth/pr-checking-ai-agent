import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { githubAppController } from '../controllers/github-app.controller.js';

const router = Router();   

router.get('/github', authController.redirectToGithub);
router.get('/github/app/install', requireAuth, githubAppController.install);
router.get('/github/app/setup', githubAppController.setup);
router.get('/github/callback', authController.githubCallback);
router.post('/logout', authController.logout);

router.post('/logout-all', requireAuth, authController.logoutAll);

export default router;