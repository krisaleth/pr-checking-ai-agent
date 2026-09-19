import Router from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { User } from '../models/index.models.js'

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});

export default router;