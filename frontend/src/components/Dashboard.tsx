import React from 'react';
import { Bell, Search } from 'lucide-react';
import OverviewChart from './OverviewChart';
import RecentTransactions from './RecentTransactions';
import TransactionsTable from './TransactionsTable';

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <input type="text" placeholder="Search..." className="bg-[var(--color-surface)] rounded-full pl-10 pr-4 py-2 focus:outline-none" />
          </div>
          <Bell className="text-[var(--color-text-secondary)]" />
          <img src="https://i.pravatar.cc/40" alt="User" className="rounded-full" />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-[var(--color-surface)] p-4 rounded-lg flex items-center space-x-4">
          <div className="bg-green-900/10 dark:bg-[var(--color-background)] p-3 rounded-lg">
            <img src="/wallet-3.svg" alt="Balance" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[var(--color-text-secondary)] text-sm">Balance</h2>
            <p className="text-2xl font-bold">$41,210</p>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] p-4 rounded-lg flex items-center space-x-4">
          <div className="bg-green-900/10 dark:bg-[var(--color-background)] p-3 rounded-lg">
            <img src="/wallet.svg" alt="Revenue" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[var(--color-text-secondary)] text-sm">Revenue</h2>
            <p className="text-2xl font-bold">$41,210</p>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] p-4 rounded-lg flex items-center space-x-4">
          <div className="bg-green-900/10 dark:bg-[var(--color-background)] p-3 rounded-lg">
            <img src="/card.svg" alt="Expenses" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[var(--color-text-secondary)] text-sm">Expenses</h2>
            <p className="text-2xl font-bold">$41,210</p>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] p-4 rounded-lg flex items-center space-x-4">
          <div className="bg-green-900/10 dark:bg-[var(--color-background)] p-3 rounded-lg">
            <img src="/dollar-circle.svg" alt="Savings" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[var(--color-text-secondary)] text-sm">Savings</h2>
            <p className="text-2xl font-bold">$41,210</p>
          </div>
        </div>
      </div>

      {/* Overview and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverviewChart />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionsTable />
    </div>
  );
};

export default Dashboard; 