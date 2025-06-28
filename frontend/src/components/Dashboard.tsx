import React, { useState, useEffect } from 'react';
import { Bell, LogOut, User, Settings, LineChart, PieChart, BarChart } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../context/AuthContext';
import OverviewChart from './OverviewChart';
import RecentTransactions from './RecentTransactions';
import TransactionsTable from './TransactionsTable';
import axios from 'axios';
import CategoryChart from './CategoryChart';
import BarChartComponent from './BarChart';
import ThemeToggle from './ThemeToggle';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ balance: 0, revenue: 0, expenses: 0, savings: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [chartView, setChartView] = useState<'line' | 'pie' | 'bar'>('line');

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.token) {
        return;
      }
      setLoadingStats(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('http://localhost:3001/api/transactions/stats', config);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex-1 text-[var(--color-text)]">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-[var(--color-surface)] p-4 rounded-lg flex items-center space-x-4">
          <div className="bg-green-900/10 dark:bg-[var(--color-background)] p-3 rounded-lg">
            <img src="/wallet-3.svg" alt="Balance" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[var(--color-text-secondary)] text-sm">Balance</h2>
            <p className="text-2xl font-bold">{loadingStats ? '...' : formatCurrency(stats.balance)}</p>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] p-4 rounded-lg flex items-center space-x-4">
          <div className="bg-green-900/10 dark:bg-[var(--color-background)] p-3 rounded-lg">
            <img src="/wallet.svg" alt="Revenue" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[var(--color-text-secondary)] text-sm">Revenue</h2>
            <p className="text-2xl font-bold">{loadingStats ? '...' : formatCurrency(stats.revenue)}</p>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] p-4 rounded-lg flex items-center space-x-4">
          <div className="bg-green-900/10 dark:bg-[var(--color-background)] p-3 rounded-lg">
            <img src="/card.svg" alt="Expenses" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[var(--color-text-secondary)] text-sm">Expenses</h2>
            <p className="text-2xl font-bold">{loadingStats ? '...' : formatCurrency(stats.expenses)}</p>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] p-4 rounded-lg flex items-center space-x-4">
          <div className="bg-green-900/10 dark:bg-[var(--color-background)] p-3 rounded-lg">
            <img src="/dollar-circle.svg" alt="Savings" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[var(--color-text-secondary)] text-sm">Savings</h2>
            <p className="text-2xl font-bold">{loadingStats ? '...' : formatCurrency(stats.savings)}</p>
          </div>
        </div>
      </div>

      {/* Overview and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {chartView === 'line' && <OverviewChart chartView={chartView} setChartView={setChartView} />}
          {chartView === 'pie' && <CategoryChart chartView={chartView} setChartView={setChartView} />}
          {chartView === 'bar' && <BarChartComponent chartView={chartView} setChartView={setChartView} />}
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions />
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionsTable />
    </div>
  );
};

export default Dashboard; 