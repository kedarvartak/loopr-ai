import express from 'express';
import { getTransactions } from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getTransactions);

export default router; 