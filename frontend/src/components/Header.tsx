import React, { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, LogOut, User, Settings } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case '/':
                return 'Dashboard';
            case '/transactions':
                return 'Transactions';
            case '/wallet':
                return 'Wallet'; 
            case '/analytics':
                return 'Analytics Dashboard';   
            default:
                return 'Penta';
        }
    };

    return (
      <header className="flex justify-between items-center p-6 bg-[var(--color-background)]">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">{getTitle()}</h1>
          <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Bell className="text-[var(--color-text-secondary)]" />

              <Menu as="div" className="relative inline-block text-left">
                  <div>
                      <Menu.Button className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-[var(--color-surface-variant)] rounded-md bg-[var(--color-surface)] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-1 py-1">
                              <div className="px-3 py-2">
                                  <p className="text-sm font-medium text-[var(--color-text)]">{user?.name}</p>
                                  <p className="truncate text-sm text-[var(--color-text-secondary)]">{user?.email}</p>
                              </div>
                          </div>
                          <div className="px-1 py-1">
                              <Menu.Item>
                                  {({ active }) => (
                                      <button className={`${active ? 'bg-[var(--color-surface-variant)]' : ''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]`}>
                                          <User className="mr-3 h-5 w-5" aria-hidden="true" />
                                          Profile
                                      </button>
                                  )}
                              </Menu.Item>
                              <Menu.Item>
                                  {({ active }) => (
                                      <button className={`${active ? 'bg-[var(--color-surface-variant)]' : ''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]`}>
                                          <Settings className="mr-3 h-5 w-5" aria-hidden="true" />
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
                                          className={`${active ? 'bg-red-500/20 text-red-400' : 'text-[var(--color-text-secondary)]'} group flex w-full items-center rounded-md px-3 py-2 text-sm hover:text-red-400`}
                                      >
                                          <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
                                          Sign out
                                      </button>
                                  )}
                              </Menu.Item>
                          </div>
                      </Menu.Items>
                  </Transition>
              </Menu>
          </div>
      </header>
    );
};

export default Header; 