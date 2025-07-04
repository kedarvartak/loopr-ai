import express from 'express';
import {
  getTransactions,
  getTransactionStats,
  getOverviewStats,
  getCategoryStats,
  exportTransactions,
} from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';
import { authorizeAnalyst } from '../middleware/authorizeAnalyst';

const router = express.Router();

router.route('/').get(protect, authorizeAnalyst, getTransactions);
router.route('/stats').get(protect, authorizeAnalyst, getTransactionStats);
router.route('/overview').get(protect, authorizeAnalyst, getOverviewStats);
router.route('/categories').get(protect, authorizeAnalyst, getCategoryStats);
router.route('/export').post(protect, authorizeAnalyst, exportTransactions);

export default router; 