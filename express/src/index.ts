import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

const port = process.env.PORT || 3001;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
}); 