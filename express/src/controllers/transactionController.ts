import { Request, Response } from 'express';
import Transaction from '../models/transactionModel';
import { IRequest } from '../types/requestTypes';
import redisClient from '../config/redis';
import { exportQueue } from '../queues/exportQueue';

// @desc    Get transactions with filtering, sorting, and pagination
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req: IRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = req.query.sortBy as string || 'date';
    const order = req.query.order as string === 'asc' ? 1 : -1;
    const searchQuery = req.query.search as string;

    const { status, category, minAmount, maxAmount, startDate, endDate } = req.query;

    const pipeline: any[] = [];
    const matchStage: any = {}; // Start with an empty match stage

    // All filters remain the same, but we no longer add user_id here
    if (status) matchStage.status = status;
    if (category) matchStage.category = category;
    if (minAmount || maxAmount) {
      matchStage.amount = {};
      if (minAmount) matchStage.amount.$gte = parseFloat(minAmount as string);
      if (maxAmount) matchStage.amount.$lte = parseFloat(maxAmount as string);
    }
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate as string);
      if (endDate) matchStage.date.$lte = new Date(endDate as string);
    }
    
    pipeline.push({ $match: matchStage });

    // Join with the users collection
    pipeline.push({
      $lookup: {
        from: 'users', // The collection to join with
        localField: 'user_id', // Field from the input documents (transactions)
        foreignField: 'user_id', // Field from the documents of the "from" collection (users)
        as: 'userDetails' // The new array field to add to the input documents
      }
    });

    // Deconstruct the userDetails array and promote fields
    pipeline.push({ $unwind: '$userDetails' });
    
    // Add a temporary field for sorting by user name
    pipeline.push({
      $addFields: {
        userName: '$userDetails.name'
      }
    });

    if (searchQuery) {
        const searchRegex = new RegExp(searchQuery, 'i');
        // Add user name to the search criteria
        pipeline.push({
          $match: {
            $or: [
              { description: { $regex: searchRegex } },
              { category: { $regex: searchRegex } },
              { status: { $regex: searchRegex } },
              { 'userDetails.name': { $regex: searchRegex } }
            ]
          }
        });
    }
    
    // Adjust the sort key to use our new 'userName' field.
    const sortKey = sortBy === 'user.name' ? 'userName' : sortBy;
    pipeline.push({ $sort: { [sortKey]: order } });
    
    pipeline.push({
      $facet: {
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          // Reshape the final output for the frontend
          {
            $project: {
              _id: 1,
              date: 1,
              amount: 1,
              category: 1,
              status: 1,
              description: 1,
              user: {
                name: '$userDetails.name',
                email: '$userDetails.email',
                user_id: '$userDetails.user_id'
              }
            }
          }
        ],
        totalCount: [
          { $count: 'count' }
        ]
      }
    });

    const result = await Transaction.aggregate(pipeline);
    const transactions = result[0].data;
    const totalCount = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;

    res.json({
      data: transactions,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getTransactionStats = async (req: IRequest, res: Response): Promise<void> => {
  try {
    const cacheKey = `stats:all_users`;

    // 1. Check cache first
    const cachedStats = await redisClient.get(cacheKey);
    if (cachedStats) {
      console.log('Serving global stats from cache');
      res.json(JSON.parse(cachedStats));
      return;
    }

    console.log('Serving global stats from DB');
    // 2. If not in cache, query DB - $match is now empty to get all users
    const stats = await Transaction.aggregate([
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

    const result = {
      revenue,
      expenses,
      balance,
      savings,
    };

    // 3. Store result in cache with an expiration time 
    await redisClient.setEx(cacheKey, 120, JSON.stringify(result));
    console.log(`Global stats stored in cache for 2 minutes.`);

    res.json(result);
  } catch (error) {
    console.error('Error fetching transaction stats ->', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getOverviewStats = async (req: IRequest, res: Response): Promise<void> => {
  try {
    const stats = await Transaction.aggregate([
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
    console.error('Error fetching overview stats ->', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getCategoryStats = async (req: IRequest, res: Response): Promise<void> => {
  try {
    const categoryStats = await Transaction.aggregate([
      { $match: { category: { $ne: 'Revenue' } } },
      {
        $group: {
          _id: '$status', 
          value: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1,
        },
      },
    ]);
    
    res.json(categoryStats);

  } catch (error) {
    console.error('Error fetching category stats ->', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const exportTransactions = async (req: IRequest, res: Response) => {
    try {
        if (!req.user || !req.user.user_id) {
            res.status(401).json({ message: 'Not authorized, user data is missing' });
            return;
        }

        const { columns, filters, sort, search } = req.body;
        
        const job = await exportQueue.add('export-csv', {
            userId: req.user.user_id,
            columns,
            filters,
            sort,
            search,
        });

        res.status(202).json({ 
            message: 'Export job has been queued successfully',
            jobId: job.id 
        });

    } catch (error) {
        console.error('Export Queueing Error ->', error);
        res.status(500).json({ message: 'Server Error while queueing export job' });
    }
};

export { getTransactions, getTransactionStats, getOverviewStats, getCategoryStats, exportTransactions }; 