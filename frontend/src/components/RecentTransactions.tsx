import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Transaction {
  _id: string;
  user_id: string;
  date: string;
  amount: number;
  category: string;
  status: string;
}

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      if (!user?.token) {
        return;
      }
      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const params = new URLSearchParams({
          page: '1',
          limit: '5',
          sortBy: 'date',
          order: 'desc',
        });
        const response = await axios.get(`http://localhost:3001/api/transactions?${params.toString()}`, config);
        if (response.data.data) {
          setTransactions(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch recent transactions.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTransactions();
  }, [user]);


  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[var(--color-text)] text-lg font-semibold">Recent Transactions</h2>
        <Link to="/transactions" className="text-sm text-[var(--color-primary)] hover:underline">
          See All
        </Link>
      </div>
      <ul className="flex-grow overflow-y-auto -mr-3 pr-3">
        {loading ? (
          <p className="text-center text-[var(--color-text-secondary)]">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-[var(--color-text-secondary)]">No recent transactions.</p>
        ) : (
          transactions.map((transaction) => (
            <li key={transaction._id} className="flex justify-between items-center py-2">
              <div className="flex items-center">
                <img src={`https://i.pravatar.cc/30?u=${transaction.user_id}`} alt="User" className="rounded-full mr-4" />
                <div>
                  <p className="text-[var(--color-text)]">{transaction.user_id}</p>
                  <p className="text-[var(--color-text-secondary)] text-sm">{transaction.category === 'Revenue' ? 'Income' : 'Expense'}</p>
                </div>
              </div>
              <p className={transaction.category === 'Revenue' ? 'text-[var(--color-accent-positive)]' : 'text-[var(--color-accent-negative)]'}>
                {transaction.category === 'Revenue' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecentTransactions; 