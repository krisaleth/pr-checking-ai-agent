import Router from 'express';
import { openrouterResponse } from '../controllers/openrouter.controller.js';
import { getPullRequestDiff } from '../controllers/github.controller.js';
import AnalysisPRResponse from '../controllers/analysis.controller.js';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.middleware.js';
import { User } from '../models/index.models.js'

const router = Router();

const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        error: 'AI analysis rate limit exceeded. Try again in a minute. '
    },
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});
router.post('/response', openrouterResponse);
router.get('/pull-requests/:owner/:repo/pulls/:pull_number/diff', getPullRequestDiff);
router.get('/repos/:owner/:repo/pulls/:pull_number/analysis', aiLimiter, AnalysisPRResponse);

export default router;