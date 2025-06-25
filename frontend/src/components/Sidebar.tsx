import React from 'react';
import { LayoutGrid, ChevronsLeft } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  return (
    <div className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} bg-[var(--color-surface)] text-[var(--color-text)] flex flex-col`}>
      <div className={`p-6 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && <img src="/logo.svg" alt="Penta" className="h-8" />}
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-[var(--color-background)]">
          <ChevronsLeft className={`transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
        </button>
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        <a href="#" className={`flex items-center p-3 rounded-lg bg-[var(--color-background)] ${!isOpen && 'justify-center'}`}>
          <LayoutGrid className={`${isOpen ? 'mr-3' : ''} text-[var(--color-primary)]`} />
          {isOpen && <span className="truncate">Dashboard</span>}
        </a>
        <a href="#" className={`flex items-center p-3 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] ${!isOpen && 'justify-center'}`}>
          <img src="/wallet-2.svg" alt="Transactions" className={`w-6 h-6 ${isOpen ? 'mr-3' : ''}`} />
          {isOpen && <span className="truncate">Transactions</span>}
        </a>
        <a href="#" className={`flex items-center p-3 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] ${!isOpen && 'justify-center'}`}>
          <img src="/wallet-minus.svg" alt="Wallet" className={`w-6 h-6 ${isOpen ? 'mr-3' : ''}`} />
          {isOpen && <span className="truncate">Wallet</span>}
        </a>
        <a href="#" className={`flex items-center p-3 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] ${!isOpen && 'justify-center'}`}>
          <img src="/presention-chart.svg" alt="Analytics" className={`w-6 h-6 ${isOpen ? 'mr-3' : ''}`} />
          {isOpen && <span className="truncate">Analytics</span>}
        </a>
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