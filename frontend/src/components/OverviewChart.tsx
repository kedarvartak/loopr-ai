import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ChartSwitcher from './ChartSwitcher';

type ChartView = 'line' | 'pie' | 'bar';

interface ChartProps {
  chartView: ChartView;
  setChartView: (view: ChartView) => void;
}

interface ChartData {
  name: string;
  Income: number;
  Expenses: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Access the full data point
    return (
      <div className="bg-[var(--color-surface)] text-[var(--color-text)] p-3 rounded-lg shadow-lg border border-[var(--color-surface-variant)]">
        <p className="text-sm font-semibold mb-2">{data.name}</p>
        <p className="text-[var(--color-accent-positive)]">Income: ${data.Income.toFixed(2)}</p>
        <p className="text-[var(--color-accent-negative)]">Expenses: ${data.Expenses.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const OverviewChart: React.FC<ChartProps> = ({ chartView, setChartView }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOverviewData = async () => {
      if (!user?.token) return;
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:3001/api/transactions/overview', config);
        
        // Ensure we have data for all months for a consistent chart
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const processedData = monthNames.map(month => {
          const existingMonth = data.find((d: ChartData) => d.name === month);
          return existingMonth || { name: month, Income: 0, Expenses: 0 };
        });

        setChartData(processedData);
      } catch (error) {
        toast.error('Failed to fetch overview data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewData();
  }, [user]);

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[var(--color-text)] text-lg font-semibold">Monthly Overview</h2>
        <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full"></div>
                    <span className="text-[var(--color-text-secondary)]">Income</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[var(--color-accent-pending)] rounded-full"></div>
                    <span className="text-[var(--color-text-secondary)]">Expenses</span>
                </div>
            </div>
            <ChartSwitcher chartView={chartView} setChartView={setChartView} />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {loading ? (
           <div className="flex items-center justify-center h-full">
            <p className="text-[var(--color-text-secondary)]">Loading Chart...</p>
           </div>
        ) : (
          <LineChart 
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid stroke="var(--color-surface-variant)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="var(--color-text-secondary)" axisLine={false} tickLine={false} />
            <YAxis 
              stroke="var(--color-text-secondary)" 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `$${value}`}
              domain={[0, 'dataMax + 100']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeDasharray: '5 5' }} />
            <Line type="monotone" dataKey="Income" stroke="var(--color-primary)" strokeWidth={2} dot={false} activeDot={{ r: 8, strokeWidth: 2, fill: 'var(--color-primary)', stroke: 'var(--color-surface)' }} />
            <Line type="monotone" dataKey="Expenses" stroke="var(--color-accent-pending)" strokeWidth={2} dot={false} activeDot={{ r: 8, strokeWidth: 2, fill: 'var(--color-accent-pending)', stroke: 'var(--color-surface)' }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default OverviewChart; 