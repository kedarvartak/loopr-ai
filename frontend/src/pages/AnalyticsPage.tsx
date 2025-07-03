import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import OverviewChart from '../components/OverviewChart';
import CategoryChart from '../components/CategoryChart';
import BarChartComponent from '../components/BarChart';

interface StatCardProps {
    title: string;
    value: string;
    description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => (
    <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
        <p className="text-[var(--color-text-secondary)] text-sm">{title}</p>
        <p className="text-3xl font-bold my-2">{value}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
    </div>
);

const AnalyticsPage: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ balance: 0, revenue: 0, expenses: 0 });
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const { data } = await axios.get(
                    'http://localhost:3001/api/transactions/stats'
                );
                setStats(data);
            } catch (error) {
                toast.error('Failed to fetch analytics data');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const statCards = [
        {
            title: 'Total Balance',
            value: loading ? '...' : formatCurrency(stats.balance),
            description: "Your current account balance"
        },
        {
            title: 'Total Revenue',
            value: loading ? '...' : formatCurrency(stats.revenue),
            description: "Total income this month"
        },
        {
            title: 'Total Expenses',
            value: loading ? '...' : formatCurrency(stats.expenses),
            description: "Total spending this month"
        }
    ];

    return (
        <div className="flex-1 text-[var(--color-text)] p-4 md:p-8 bg-[var(--color-background)]">
            <div className="max-w-7xl mx-auto">
                
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map(card => <StatCard key={card.title} {...card} />)}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Income vs. Expense</h3>
                        <div className="h-[350px]">
                            <OverviewChart chartView="line" setChartView={() => {}} />
                        </div>
                    </div>
                    <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Category Breakdown</h3>
                        <div className="h-[350px]">
                            <CategoryChart chartView="pie" setChartView={() => {}} />
                        </div>
                    </div>
                </div>

                 <div className="mt-8 bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Monthly Trends</h3>
                    <div className="h-[400px]">
                        <BarChartComponent chartView="bar" setChartView={() => {}} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage; 