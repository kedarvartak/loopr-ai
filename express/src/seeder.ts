import dotenv from 'dotenv';
import connectDB from './config/db';
import User from './models/userModel';
import Transaction from './models/transactionModel';
import transactions from './data/transactions';

dotenv.config();

const users = [
  {
    name: 'User One',
    email: 'user1@test.com',
    password: 'Password@123',
    user_id: 'user_001',
  },
  {
    name: 'User Two',
    email: 'user2@test.com',
    password: 'Password@123',
    user_id: 'user_002',
  },
  {
    name: 'User Three',
    email: 'user3@test.com',
    password: 'Password@123',
    user_id: 'user_003',
  },
  {
    name: 'User Four',
    email: 'user4@test.com',
    password: 'Password@123',
    user_id: 'user_004',
  },
];

const importData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Transaction.deleteMany();
    await User.create(users);
    await Transaction.insertMany(transactions);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Transaction.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 