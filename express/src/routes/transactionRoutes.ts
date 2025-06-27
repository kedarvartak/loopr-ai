import express from 'express';
import { getTransactions, getTransactionStats, getOverviewStats, getCategoryStats } from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getTransactions);
router.route('/stats').get(protect, getTransactionStats);
router.route('/overview').get(protect, getOverviewStats);
router.route('/categories').get(protect, getCategoryStats);

export default router; 