import React from 'react';

const RecentTransactions: React.FC = () => {
  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[var(--color-text)] text-lg font-semibold">Recent Transaction</h2>
        <a href="#" className="text-[var(--color-primary)]">See all</a>
      </div>
      <ul className="flex-grow overflow-y-auto -mr-3 pr-3 flex flex-col justify-between">
        <li className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <img src="https://i.pravatar.cc/30?u=a" alt="User" className="rounded-full mr-4" />
            <div>
              <p className="text-[var(--color-text)]">Matheus Ferrero</p>
              <p className="text-[var(--color-text-secondary)] text-sm">Transfers from</p>
            </div>
          </div>
          <p className="text-[var(--color-accent-positive)]">+$54.08</p>
        </li>
        <li className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <img src="https://i.pravatar.cc/30?u=b" alt="User" className="rounded-full mr-4" />
            <div>
              <p className="text-[var(--color-text)]">Floyd Miles</p>
              <p className="text-[var(--color-text-secondary)] text-sm">Transfers to</p>
            </div>
          </div>
          <p className="text-[var(--color-accent-negative)]">-$39.65</p>
        </li>
        <li className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <img src="https://i.pravatar.cc/30?u=c" alt="User" className="rounded-full mr-4" />
            <div>
              <p className="text-[var(--color-text)]">Jerome Bell</p>
              <p className="text-[var(--color-text-secondary)] text-sm">Transfers to</p>
            </div>
          </div>
          <p className="text-[var(--color-accent-negative)]">-$29.78</p>
        </li>
        <li className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <img src="https://i.pravatar.cc/30?u=d" alt="User" className="rounded-full mr-4" />
            <div>
              <p className="text-[var(--color-text)]">Ronald Richards</p>
              <p className="text-[var(--color-text-secondary)] text-sm">Transfers from</p>
            </div>
          </div>
          <p className="text-[var(--color-accent-positive)]">+$112.45</p>
        </li>
        <li className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <img src="https://i.pravatar.cc/30?u=e" alt="User" className="rounded-full mr-4" />
            <div>
              <p className="text-[var(--color-text)]">Kristin Watson</p>
              <p className="text-[var(--color-text-secondary)] text-sm">Transfers to</p>
            </div>
          </div>
          <p className="text-[var(--color-accent-negative)]">-$44.99</p>
        </li>
      </ul>
    </div>
  );
};

export default RecentTransactions; 