import React from 'react';
import { LineChart, PieChart, BarChart } from 'lucide-react';

type ChartView = 'line' | 'pie' | 'bar';

interface ChartSwitcherProps {
  chartView: ChartView;
  setChartView: (view: ChartView) => void;
}

const ChartSwitcher: React.FC<ChartSwitcherProps> = ({ chartView, setChartView }) => {
  return (
    <div className="flex items-center space-x-1 p-1 rounded-lg bg-[var(--color-background)]">
      <button
        onClick={() => setChartView('line')}
        className={`p-2 rounded-md transition-colors ${chartView === 'line' ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-surface-variant)] text-[var(--color-text-secondary)]'}`}
        aria-label="Show Line Chart"
      >
        <LineChart size={16} />
      </button>
      <button
        onClick={() => setChartView('bar')}
        className={`p-2 rounded-md transition-colors ${chartView === 'bar' ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-surface-variant)] text-[var(--color-text-secondary)]'}`}
        aria-label="Show Bar Chart"
      >
        <BarChart size={16} />
      </button>
      <button
        onClick={() => setChartView('pie')}
        className={`p-2 rounded-md transition-colors ${chartView === 'pie' ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-surface-variant)] text-[var(--color-text-secondary)]'}`}
        aria-label="Show Pie Chart"
      >
        <PieChart size={16} />
      </button>
    </div>
  );
};

export default ChartSwitcher; 