
import Router from 'express';
import { postResponse } from '../controllers/response.controller.js';
import { getPullRequestDiff } from '../controllers/github.controller.js';

const router = Router();
router.post('/response', postResponse);
router.get('/pull-requests/:owner/:repo/pulls/:pull_number/diff', getPullRequestDiff);

export default router;