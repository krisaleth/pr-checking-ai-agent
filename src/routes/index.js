
import Router from 'express';
import { postResponse } from '../controllers/response.controller.js';

const router = Router();
router.post('/response', postResponse);

export default router;