import React, { useState } from 'react';
import { Search, Calendar, Upload } from 'lucide-react';
import ExportModal from './ExportModal';

const TransactionsTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <div className="flex items-center space-x-2 text-[var(--color-text-secondary)]">
              <Calendar />
              <span>10 May - 20 May</span>
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
              <th className="p-2 text-[var(--color-text-secondary)]">Name</th>
              <th className="p-2 text-[var(--color-text-secondary)]">Date</th>
              <th className="p-2 text-[var(--color-text-secondary)]">Amount</th>
              <th className="p-2 text-[var(--color-text-secondary)]">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[var(--color-background)]">
              <td className="p-2 text-[var(--color-text)]">Matheus Ferrero</td>
              <td className="p-2 text-[var(--color-text-secondary)]">Sat, 20 Apr 2020</td>
              <td className="p-2 text-[var(--color-accent-positive)]">+$80.09</td>
              <td className="p-2"><span className="bg-[var(--color-accent-positive)] text-white px-2 py-1 rounded-full text-xs">Completed</span></td>
            </tr>
            <tr className="border-t border-[var(--color-background)]">
              <td className="p-2 text-[var(--color-text)]">Floyd Miles</td>
              <td className="p-2 text-[var(--color-text-secondary)]">Fri, 19 Apr 2020</td>
              <td className="p-2 text-[var(--color-accent-negative)]">-$7.03</td>
              <td className="p-2"><span className="bg-[var(--color-accent-positive)] text-white px-2 py-1 rounded-full text-xs">Completed</span></td>
            </tr>
            <tr className="border-t border-[var(--color-background)]">
              <td className="p-2 text-[var(--color-text)]">Jerome Bell</td>
              <td className="p-2 text-[var(--color-text-secondary)]">Tue, 19 Apr 2020</td>
              <td className="p-2 text-[var(--color-accent-negative)]">-$30.09</td>
              <td className="p-2"><span className="bg-[var(--color-accent-pending)] text-white px-2 py-1 rounded-full text-xs">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <ExportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default TransactionsTable; 