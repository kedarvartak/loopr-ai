import React from 'react';
import { format } from 'date-fns';

interface MiniTableProps {
  transactions: any[];
}

const TransactionsMiniTable: React.FC<MiniTableProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-[var(--color-text-secondary)]">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Description</th>
            <th className="p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i} className="border-t border-[var(--color-border)]">
              <td className="p-2 whitespace-nowrap">{format(new Date(t.date), 'MMM dd')}</td>
              <td className="p-2 truncate max-w-xs">{t.description || 'N/A'}</td>
              <td className="p-2 text-right font-medium">${t.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsMiniTable; 