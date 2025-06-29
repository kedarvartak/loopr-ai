import { Worker, Job } from 'bullmq';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/transactionModel';
import redisClient from '../config/redis';

dotenv.config();

const redisUrl = process.env.REDIS_URI;
if (!redisUrl) {
    throw new Error('REDIS_URI is not defined');
}

const connection = {
  host: new URL(redisUrl).hostname,
  port: parseInt(new URL(redisUrl).port),
  username: new URL(redisUrl).username,
  password: new URL(redisUrl).password,
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Worker connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error in worker:', error);
        process.exit(1);
    }
};

const processExportJob = async (job: Job) => {
    const { userId, columns, filters, sort, search } = job.data;
    const statusKey = `export-status:${job.id}`;
    console.log(`Processing job ${job.id} for user ${userId}...`);

    try {
        await redisClient.set(statusKey, JSON.stringify({ status: 'processing' }), { EX: 3600 }); // Expire in 1 hour

        const query: any = { user_id: userId };
        if (filters.status && filters.status.length > 0) query.status = { $in: filters.status };
        if (filters.category && filters.category.length > 0) query.category = { $in: filters.category };
        if (filters.minAmount || filters.maxAmount) {
            query.amount = {};
            if (filters.minAmount) query.amount.$gte = parseFloat(filters.minAmount);
            if (filters.maxAmount) query.amount.$lte = parseFloat(filters.maxAmount);
        }
        if (filters.startDate || filters.endDate) {
            query.date = {};
            if (filters.startDate) query.date.$gte = new Date(filters.startDate);
            if (filters.endDate) query.date.$lte = new Date(filters.endDate);
        }
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            const numericSearch = !isNaN(parseFloat(search)) ? [{ amount: parseFloat(search) }] : [];
            query.$or = [
                { user_id: { $regex: searchRegex } },
                { status: { $regex: searchRegex } },
                { category: { $regex: searchRegex } },
                ...numericSearch
            ];
        }

        const sortOrder = sort.direction === 'asc' ? 1 : -1;
        const transactions = await Transaction.find(query)
            .sort({ [sort.key]: sortOrder })
            .lean();

        if (transactions.length === 0) {
            console.log(`Job ${job.id} completed: No transactions found.`);
            await redisClient.set(statusKey, JSON.stringify({ status: 'completed', url: null }), { EX: 3600 });
            return;
        }

        const json2csvParser = new Parser({ fields: columns });
        const csv = json2csvParser.parse(transactions);

        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        
        const fileName = `export-${job.id}.csv`;
        const filePath = path.join(tempDir, fileName);
        fs.writeFileSync(filePath, csv);

        console.log(`Job ${job.id} completed. CSV saved to ${filePath}`);
        
        const downloadUrl = `/exports/${fileName}`;
        await redisClient.set(statusKey, JSON.stringify({ status: 'completed', url: downloadUrl }), { EX: 3600 });

    } catch (error) {
        console.error(`Job ${job.id} failed:`, error);
        await redisClient.set(statusKey, JSON.stringify({ status: 'failed', error: 'An error occurred during export.' }), { EX: 3600 });
        throw error; 
    }
};


const startWorker = async () => {
    await connectDB();
    
    console.log('Worker started, waiting for jobs...');

    new Worker('csv-export', processExportJob, { connection });
};

startWorker(); 