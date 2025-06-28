import React from 'react';
import { LayoutGrid, ChevronsLeft } from 'lucide-react';
import Logo from './Logo';
import { NavLink } from 'react-router-dom';
import TransactionIcon from './TransactionIcon';
import WalletIcon from './WalletIcon';
import AnalyticsIcon from './AnalyticsIcon';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  
  const getLinkClasses = (isActive: boolean) =>
    `flex items-center p-3 rounded-lg ${!isOpen && 'justify-center'} ` +
    (isActive
      ? 'bg-[var(--color-background)] text-[var(--color-text)]'
      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)]');

  return (
    <div className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} bg-[var(--color-surface)] text-[var(--color-text)] flex flex-col`}>
      <div className={`p-6 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && <Logo />}
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-[var(--color-background)]">
          <ChevronsLeft className={`transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
        </button>
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        <NavLink to="/" className={({ isActive }) => getLinkClasses(isActive)} end>
          {({ isActive }) => (
            <>
              <LayoutGrid className={`${isOpen ? 'mr-3' : ''} ${isActive ? 'text-[var(--color-primary)]' : ''}`} />
              {isOpen && <span className="truncate">Dashboard</span>}
            </>
          )}
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => getLinkClasses(isActive)}>
          {({ isActive }) => (
            <>
              <TransactionIcon className={`w-6 h-6 ${isOpen ? 'mr-3' : ''} ${isActive ? 'text-[var(--color-primary)]' : ''}`} />
              {isOpen && <span className="truncate">Transactions</span>}
            </>
          )}
        </NavLink>
        <NavLink to="/wallet" className={({ isActive }) => getLinkClasses(isActive)}>
          {({ isActive }) => (
            <>
              <WalletIcon className={`w-6 h-6 ${isOpen ? 'mr-3' : ''} ${isActive ? 'text-[var(--color-primary)]' : ''}`} />
              {isOpen && <span className="truncate">Wallet</span>}
            </>
          )}
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => getLinkClasses(isActive)}>
          {({ isActive }) => (
            <>
              <AnalyticsIcon className={`w-6 h-6 ${isOpen ? 'mr-3' : ''} ${isActive ? 'text-[var(--color-primary)]' : ''}`} />
              {isOpen && <span className="truncate">Analytics</span>}
            </>
          )}
        </NavLink>
        <a href="#" className={`flex items-center p-3 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] ${!isOpen && 'justify-center'}`}>
          <img src="/user.svg" alt="Personal" className={`w-6 h-6 ${isOpen ? 'mr-3' : ''}`} />
          {isOpen && <span className="truncate">Personal</span>}
        </a>
        <a href="#" className={`flex items-center p-3 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] ${!isOpen && 'justify-center'}`}>
          <img src="/sms.svg" alt="Message" className={`w-6 h-6 ${isOpen ? 'mr-3' : ''}`} />
          {isOpen && <span className="truncate">Message</span>}
        </a>
        <a href="#" className={`flex items-center p-3 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] ${!isOpen && 'justify-center'}`}>
          <img src="/setting-2.svg" alt="Settings" className={`w-6 h-6 ${isOpen ? 'mr-3' : ''}`} />
          {isOpen && <span className="truncate">Setting</span>}
        </a>
      </nav>
    </div>
  );
};

export default Sidebar; 