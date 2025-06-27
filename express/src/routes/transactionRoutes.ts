import express from 'express';
import { getTransactions, getTransactionStats } from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getTransactions);
router.route('/stats').get(protect, getTransactionStats);

export default router; 