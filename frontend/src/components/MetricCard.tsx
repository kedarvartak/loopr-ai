import { ArrowDown, ArrowUp, Hash } from 'lucide-react';
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: 'count' | 'total' | 'average';
}

const ICONS = {
    count: <Hash className="w-5 h-5" />,
    total: <ArrowUp className="w-5 h-5 text-green-500" />,
    average: <ArrowDown className="w-5 h-5 text-red-500" />,
};

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-[var(--color-surface-variant)] p-4 rounded-lg flex items-center space-x-3">
      <div className="bg-[var(--color-surface)] p-2 rounded-lg">
        {ICONS[icon]}
      </div>
      <div>
        <h3 className="text-[var(--color-text-secondary)] text-sm">{label}</h3>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard; 