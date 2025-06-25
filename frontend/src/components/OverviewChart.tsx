import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

const data = [
  { name: 'Jan', Income: 400, Expenses: 240 },
  { name: 'Feb', Income: 850, Expenses: 139 },
  { name: 'Mar', Income: 200, Expenses: 580 },
  { name: 'Apr', Income: 680, Expenses: 390 },
  { name: 'May', Income: 790, Expenses: 480 },
  { name: 'Jun', Income: 650, Expenses: 380 },
  { name: 'Jul', Income: 349, Expenses: 430 },
  { name: 'Aug', Income: 200, Expenses: 900 },
  { name: 'Sep', Income: 500, Expenses: 100 },
  { name: 'Oct', Income: 1000, Expenses: 400 },
  { name: 'Nov', Income: 780, Expenses: 608 },
  { name: 'Dec', Income: 490, Expenses: 880 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1FCB4F] text-white p-3 rounded-lg shadow-lg">
        <p className="text-sm">{`${payload[0].name}`}</p>
        <p className="font-bold text-lg">{`$${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

const OverviewChart: React.FC = () => {
  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">Overview</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full"></div>
            <span className="text-[var(--color-text-secondary)]">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[var(--color-accent-pending)] rounded-full"></div>
            <span className="text-[var(--color-text-secondary)]">Expenses</span>
          </div>
          <button className="flex items-center space-x-2 bg-[#282C35] text-white px-3 py-1.5 rounded-lg">
            <span>Monthly</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--color-text-secondary)" axisLine={false} tickLine={false} />
          <YAxis 
            stroke="var(--color-text-secondary)" 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(value) => `$${value}`}
            domain={[0, 'dataMax + 100']}
            ticks={[0, 100, 300, 900, 1100]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeDasharray: '5 5' }} />
          <Line type="monotone" dataKey="Income" stroke="var(--color-primary)" strokeWidth={2} dot={false} activeDot={{ r: 8, strokeWidth: 2, fill: 'var(--color-primary)', stroke: 'white' }} />
          <Line type="monotone" dataKey="Expenses" stroke="var(--color-accent-pending)" strokeWidth={2} dot={false} activeDot={{ r: 8, strokeWidth: 2, fill: 'var(--color-accent-pending)', stroke: 'white' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverviewChart; 