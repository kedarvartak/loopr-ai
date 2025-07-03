import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700">
        <p className="text-sm font-semibold mb-2">{data.name}</p>
        <p className="text-green-400">Income: ${data.Income.toFixed(2)}</p>
        <p className="text-red-400">Expenses: ${data.Expenses.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const BarChartComponent: React.FC<ChartProps> = ({ chartView, setChartView }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOverviewData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:3001/api/transactions/overview');
        
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
        <h2 className="text-white text-lg font-semibold">Monthly Overview</h2>
        <ChartSwitcher chartView={chartView} setChartView={setChartView} />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {loading ? (
           <div className="flex items-center justify-center h-full">
            <p className="text-[var(--color-text-secondary)]">Loading Chart</p>
           </div>
        ) : (
          <BarChart 
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--color-text-secondary)" axisLine={false} tickLine={false} />
            <YAxis 
              stroke="var(--color-text-secondary)" 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
            <Legend wrapperStyle={{fontSize: '14px', color: 'var(--color-text-secondary)'}}/>
            <Bar dataKey="Income" fill="var(--color-primary)" />
            <Bar dataKey="Expenses" fill="var(--color-accent-pending)" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent; 