import React from 'react';
import TransactionsTable from '../components/TransactionsTable';

const TransactionsPage: React.FC = () => {
  return (
    <div className="flex-1 text-[var(--color-text)]">
      <TransactionsTable />
    </div>
  );
};

export default TransactionsPage; 