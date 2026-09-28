import { Router } from 'express';
import { githubWebhookController } from '../controllers/github.webhook.controller.js';

const router = Router();

router.post(
  '/webhooks',
  githubWebhookController.handle
);

export default router;