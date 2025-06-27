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
        
        // Base text search
        const textSearch = {
            $or: [
                { user_id: { $regex: searchRegex } },
                { status: { $regex: searchRegex } },
                { category: { $regex: searchRegex } },
            ]
        };

        // Numeric search
        const numericSearch = [];
        const potentialAmount = parseFloat(searchQuery);
        if (!isNaN(potentialAmount)) {
            numericSearch.push({ amount: potentialAmount });
        }

        if (numericSearch.length > 0) {
            query.$or = [
                ...textSearch.$or,
                ...numericSearch
            ];
        } else {
            query.$or = textSearch.$or;
        }
    }

    const transactions = await Transaction.find(query)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await Transaction.countDocuments(query);

    console.log('--- DATABASE QUERY RESULTS ---');
    console.log('Query used:', query);
    console.log('Found transactions:', transactions);
    console.log('Total count for query:', totalCount);
    console.log('----------------------------');

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

const getTransactionStats = async (req: IRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.user_id) {
      res.status(401).json({ message: 'Not authorized, user data is missing.' });
      return;
    }

    const userId = req.user.user_id;

    const stats = await Transaction.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    let revenue = 0;
    let expenses = 0;

    stats.forEach(stat => {
      if (stat._id === 'Revenue') {
        revenue = stat.totalAmount;
      } else if (stat._id === 'Expense') {
        expenses = stat.totalAmount;
      }
    });

    const balance = revenue - expenses;
    const savings = balance; 

    res.json({
      revenue,
      expenses,
      balance,
      savings,
    });
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getOverviewStats = async (req: IRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.user_id) {
      res.status(401).json({ message: 'Not authorized, user data is missing.' });
      return;
    }

    const userId = req.user.user_id;

    const stats = await Transaction.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            category: "$category"
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format data for the chart
    const monthlyData: { [key: string]: { name: string, Income: number, Expenses: number } } = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    stats.forEach(item => {
      const monthName = monthNames[item._id.month - 1];
      if (!monthlyData[monthName]) {
        monthlyData[monthName] = { name: monthName, Income: 0, Expenses: 0 };
      }
      if (item._id.category === 'Revenue') {
        monthlyData[monthName].Income += item.totalAmount;
      } else if (item._id.category === 'Expense') {
        monthlyData[monthName].Expenses += item.totalAmount;
      }
    });

    const chartData = Object.values(monthlyData);
    
    res.json(chartData);

  } catch (error) {
    console.error('Error fetching overview stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getTransactions, getTransactionStats, getOverviewStats }; 