import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  id: number;
  date: Date;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  user_profile: string;
}

const transactionSchema: Schema<ITransaction> = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Revenue', 'Expense'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending'],
    required: true,
  },
  user_id: { // manual referencing
    type: String,
    required: true,
  },
  user_profile: {
    type: String,
    required: true,
  },
}, {
  timestamps: true 
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction; 