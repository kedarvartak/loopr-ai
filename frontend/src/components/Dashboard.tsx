import React from 'react';
import { Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../context/AuthContext';
import OverviewChart from './OverviewChart';
import RecentTransactions from './RecentTransactions';
import TransactionsTable from './TransactionsTable';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

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
          
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="flex items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">Open user menu</span>
                <img className="h-8 w-8 rounded-full" src={`https://i.pravatar.cc/40?u=${user?._id}`} alt="" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-700 rounded-md bg-[#1a1c2c] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="truncate text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button className={`${active ? 'bg-gray-700' : ''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-300`}>
                        <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
                        Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button className={`${active ? 'bg-gray-700' : ''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-300`}>
                        <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
                        Settings
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${active ? 'bg-red-500/20 text-red-400' : 'text-gray-300'} group flex w-full items-center rounded-md px-3 py-2 text-sm`}
                      >
                        <LogOut className={`mr-3 h-5 w-5 ${active ? 'text-red-400' : 'text-gray-400'}`} aria-hidden="true" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
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