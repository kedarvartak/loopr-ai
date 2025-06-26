import { Request, Response } from 'express';
import Transaction from '../models/transactionModel';
import { IRequest } from '../middleware/authMiddleware';

// @desc    Get transactions with filtering, sorting, and pagination
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req: IRequest, res: Response) => {
  try {
    if (!req.user || !req.user.user_id) {
      res.status(401).json({ message: 'Not authorized, user data is missing the transaction user_id.' });
      return;
    }
    
    // All transactions must belong to the logged-in user
    const query: any = { user_id: req.user.user_id };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = req.query.sortBy as string || 'date';
    const order = req.query.order as string === 'asc' ? 1 : -1;
    const searchQuery = req.query.search as string;

    const { status, category, minAmount, maxAmount, startDate, endDate } = req.query;

    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) {
        query.amount.$gte = parseFloat(minAmount as string);
      }
      if (maxAmount) {
        query.amount.$lte = parseFloat(maxAmount as string);
      }
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate as string);
      }
    }
    
    if (searchQuery) {
        const searchRegex = new RegExp(searchQuery, 'i');
        query.$or = [
            { user_id: searchRegex },
            { status: searchRegex },
            { category: searchRegex }
        ];
    }

    const transactions = await Transaction.find(query)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await Transaction.countDocuments(query);

    res.json({
      data: transactions,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getTransactions }; 