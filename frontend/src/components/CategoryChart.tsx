import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ChartSwitcher from './ChartSwitcher';

type ChartView = 'line' | 'pie' | 'bar';

interface ChartProps {
  chartView: ChartView;
  setChartView: (view: ChartView) => void;
}

interface CategoryData {
  name: string;
  value: number;
}

const COLORS = ['#1FCB4F', '#FFC01E', '#F43F5E', '#0088FE', '#A27CF6', '#d946ef'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-gray-800 text-white p-2 rounded-lg shadow-lg border border-gray-700">
        <p className="font-semibold">{`${name}: $${value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const CategoryChart: React.FC<ChartProps> = ({ chartView, setChartView }) => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!user?.token) return;
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:3001/api/transactions/categories', config);
        setData(data);
      } catch (error) {
        toast.error('Failed to fetch category data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [user]);

  const total = data.reduce((acc, entry) => acc + entry.value, 0);

  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">Expense Breakdown</h2>
        <ChartSwitcher chartView={chartView} setChartView={setChartView} />
      </div>
      <div className="w-full flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[var(--color-text-secondary)]">Loading Chart</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[var(--color-text-secondary)]">No expense data to display</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 h-full items-center">
            <div className="col-span-2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={5}
                    labelLine={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="col-span-1 flex flex-col justify-center space-y-3 text-sm">
              {data.map((entry, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-[var(--color-text-secondary)]">{entry.name}</span>
                  </div>
                  <span className="font-medium text-white">{total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryChart; 