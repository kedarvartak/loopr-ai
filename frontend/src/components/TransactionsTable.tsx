import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Upload, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUp, ArrowDown } from 'lucide-react';
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
  description?: string;
  user: {
    name: string;
    email: string;
    user_id: string;
  };
}

const TransactionsTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const initialFilters = {
    status: [] as string[],
    category: [] as string[],
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
  };

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // this is the debounce delay we were talking in export modal component

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      toast.error('Authentication token not found.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        sortBy: sortConfig.key,
        order: sortConfig.direction,
      });

      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (appliedFilters.startDate) params.append('startDate', appliedFilters.startDate);
      if (appliedFilters.endDate) params.append('endDate', appliedFilters.endDate);
      if (appliedFilters.category.length > 0) params.append('category', appliedFilters.category.join(','));
      if (appliedFilters.status.length > 0) params.append('status', appliedFilters.status.join(','));
      if (appliedFilters.minAmount) params.append('minAmount', appliedFilters.minAmount);
      if (appliedFilters.maxAmount) params.append('maxAmount', appliedFilters.maxAmount);

      const response = await axios.get(`http://localhost:3001/api/transactions?${params.toString()}`);
      
      if(response.data.data) {
        setTransactions(response.data.data);
        setTotalPages(response.data.totalPages);
      }
      
    } catch (error) {
      toast.error('Failed to fetch transactions.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, user, appliedFilters, debouncedSearchTerm, sortConfig]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters(filters);
  };
  
  const handleClearFilters = () => {
    setFilters(initialFilters);
    setPage(1);
    setAppliedFilters(initialFilters);
  };

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setPage(1); 
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];
    setFilters({ ...filters, category: newCategories });
  };
  
  const handleStatusChange = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    setFilters({ ...filters, status: newStatuses });
  };

  return (
    <>
      <div className="bg-[var(--color-surface)] p-6 rounded-lg mt-6">
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <input
                type="text"
                placeholder="Search for anything..."
                className="bg-[var(--color-background)] rounded-full pl-10 pr-4 py-2 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              className="flex items-center space-x-2 bg-transparent text-[var(--color-text-secondary)] px-4 py-2 rounded-lg border border-[var(--color-text-secondary)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-text)]"
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-transparent text-[var(--color-text-secondary)] px-4 py-2 rounded-lg border border-[var(--color-text-secondary)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-text)]"
            >
              <Upload size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {isFiltersVisible && (
          <div className="p-4 bg-[var(--color-surface-variant)] rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" placeholder="Start Date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} className="w-full bg-[var(--color-background)] text-[var(--color-text-secondary)] rounded-md px-3 py-2 focus:outline-none" />
                  <input type="date" placeholder="End Date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} className="w-full bg-[var(--color-background)] text-[var(--color-text-secondary)] rounded-md px-3 py-2 focus:outline-none" />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Category</label>
                <div className="flex space-x-4 pt-2">
                  {['Revenue', 'Expense'].map(cat => (
                    <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={filters.category.includes(cat)} 
                        onChange={() => handleCategoryChange(cat)} 
                        className="hidden" 
                      />
                      <span className={`w-4 h-4 rounded-sm border-2 ${filters.category.includes(cat) ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-gray-500'} flex items-center justify-center`}>
                        {filters.category.includes(cat) && <span className="text-white text-xs">✔</span>}
                      </span>
                      <span className="text-[var(--color-text)]">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Status</label>
                <div className="flex space-x-4 pt-2">
                  {['Paid', 'Pending'].map(stat => (
                    <label key={stat} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={filters.status.includes(stat)} 
                        onChange={() => handleStatusChange(stat)}
                        className="hidden"
                      />
                      <span className={`w-4 h-4 rounded-sm border-2 ${filters.status.includes(stat) ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-gray-500'} flex items-center justify-center`}>
                        {filters.status.includes(stat) && <span className="text-white text-xs">✔</span>}
                      </span>
                      <span className="text-[var(--color-text)]">{stat}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Amount Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Amount</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Min" value={filters.minAmount} onChange={(e) => setFilters({...filters, minAmount: e.target.value})} className="w-full bg-[var(--color-background)] text-[var(--color-text)] rounded-md px-3 py-2 focus:outline-none placeholder:text-[var(--color-text-secondary)]" />
                  <input type="number" placeholder="Max" value={filters.maxAmount} onChange={(e) => setFilters({...filters, maxAmount: e.target.value})} className="w-full bg-[var(--color-background)] text-[var(--color-text)] rounded-md px-3 py-2 focus:outline-none placeholder:text-[var(--color-text-secondary)]" />
                </div>
              </div>

            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={handleClearFilters} disabled={loading} className="px-6 py-2 rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] hover:opacity-90 disabled:opacity-50">Clear</button>
              <button onClick={handleApplyFilters} disabled={loading} className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50">Apply</button>
            </div>
          </div>
        )}

        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2 text-[var(--color-text-secondary)]">
                Transaction ID 
              </th>
              <th className="p-2 text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-text)]" onClick={() => handleSort('user.name')}>
                User
                {sortConfig.key === 'user.name' && (sortConfig.direction === 'asc' ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />)}
              </th>
              <th className="p-2 text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-text)]" onClick={() => handleSort('date')}>
                Date
                {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />)}
              </th>
              <th className="p-2 text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-text)]" onClick={() => handleSort('amount')}>
                Amount
                {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />)}
              </th>
              <th className="p-2 text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-text)]" onClick={() => handleSort('category')}>
                Category
                {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />)}
              </th>
              <th className="p-2 text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-text)]" onClick={() => handleSort('status')}>
                Status
                {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />)}
              </th>
            </tr>
          </thead>
          <tbody className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {transactions.length === 0 && loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4 text-[var(--color-text)]">Loading...</td>
              </tr>
            ) : transactions.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4 text-[var(--color-text)]">No transactions found.</td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="border-t border-[var(--color-background)]">
                  <td className="p-2 text-[var(--color-text)]">{transaction._id}</td>
                  <td className="p-2 text-[var(--color-text-secondary)]">{transaction.user.name}</td>
                  <td className="p-2 text-[var(--color-text-secondary)]">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="p-2 text-[var(--color-text)] font-medium">{`$${transaction.amount.toFixed(2)}`}</td>
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
      <ExportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        filters={appliedFilters}
        sortConfig={sortConfig}
        search={debouncedSearchTerm}
      />
    </>
  );
};

export default TransactionsTable; 