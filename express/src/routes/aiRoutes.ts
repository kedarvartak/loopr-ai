import express from 'express';
import { chatWithAI } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';
import { authorizeAnalyst } from '../middleware/authorizeAnalyst';

const router = express.Router();

router.route('/chat').post(protect, authorizeAnalyst, chatWithAI);

export default router; 