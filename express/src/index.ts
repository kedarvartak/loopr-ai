import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';
import path from 'path';
import redisClient from './config/redis';
import cookieParser from 'cookie-parser';


dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //HTTPOnly Cookie

app.use('/exports', express.static(path.join(__dirname, 'temp')));

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running');
});

app.get('/api/export-status/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const statusKey = `export-status:${jobId}`;
    try {
        const statusData = await redisClient.get(statusKey);
        if (statusData) {
            res.json(JSON.parse(statusData));
        } else {
            res.status(404).json({ status: 'not_found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking job status.' });
    }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 