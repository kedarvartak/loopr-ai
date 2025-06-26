import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import ExportModal from './ExportModal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Transaction {
  _id: string;
  user_id: string;
  date: string;
  amount: number;
  category: string;
  status: string;
}

const TransactionsTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.token) {
        toast.error('Authentication token not found.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const response = await axios.get(`http://localhost:3001/api/transactions?page=${page}&limit=8`, config);
        setTransactions(response.data.data);
        setTotalPages(response.data.totalPages);
        console.log(`User ${user.name} has ${response.data.totalCount} transactions.`);
      } catch (error) {
        toast.error('Failed to fetch transactions.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, user]);

  return (
    <>
      <div className="bg-[var(--color-surface)] p-6 rounded-lg mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[var(--color-text)] text-lg font-semibold">Transactions</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <input type="text" placeholder="Search for anything..." className="bg-[var(--color-background)] rounded-full pl-10 pr-4 py-2 focus:outline-none" />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-transparent text-[var(--color-text-secondary)] px-4 py-2 rounded-lg border border-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-white"
            >
              <Upload size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2 text-[var(--color-text-secondary)]">User ID</th>
              <th className="p-2 text-[var(--color-text-secondary)]">Date</th>
              <th className="p-2 text-[var(--color-text-secondary)]">Amount</th>
              <th className="p-2 text-[var(--color-text-secondary)]">Category</th>
              <th className="p-2 text-[var(--color-text-secondary)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-[var(--color-text)]">Loading...</td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="border-t border-[var(--color-background)]">
                  <td className="p-2 text-[var(--color-text)]">{transaction.user_id}</td>
                  <td className="p-2 text-[var(--color-text-secondary)]">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className={`p-2 ${transaction.category === 'Revenue' ? 'text-[var(--color-accent-positive)]' : 'text-[var(--color-accent-negative)]'}`}>
                    {transaction.category === 'Revenue' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">{transaction.category}</td>
                  <td className="p-2">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs text-white ${
                        transaction.status === 'Paid' ? 'bg-[var(--color-accent-positive)]' : 'bg-[var(--color-accent-pending)]'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[var(--color-background)] disabled:opacity-50"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <span className="text-[var(--color-text-secondary)]">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[var(--color-background)] disabled:opacity-50"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <ExportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default TransactionsTable; 