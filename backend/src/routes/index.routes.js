import Router from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { User } from '../models/index.models.js';
import { getReviewResult, getReviewHistory } from '../controllers/review.controller.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});

router.get('/reviews/:reviewId',requireAuth,getReviewResult);
router.get('/reviews', requireAuth, getReviewHistory);

export default router;