import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {  Search, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface CreditCardData {
  id: number;
  bankName: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  gradient: string;
}

const mockCards: CreditCardData[] = [
  { id: 1, bankName: 'Loop Bank', cardNumber: '5646 3500 9208 6180', cardholderName: 'User One', expiryDate: '12/26', gradient: 'from-[var(--color-primary)] to-gray-900' },
  { id: 2, bankName: 'Apex Bank', cardNumber: '7874 9889 6522 4489', cardholderName: 'User One', expiryDate: '08/25', gradient: 'from-gray-800 to-black' },
  { id: 3, bankName: 'Vertex Bank', cardNumber: '5899 5248 0805 4828', cardholderName: 'User One', expiryDate: '04/24', gradient: 'from-slate-800 to-black' },
];

interface Transaction {
    _id: string;
    date: string;
    amount: number;
    category: string;
    status: 'Paid' | 'Pending';
    description?: string;
    user_id: string; 
}


const CreditCard: React.FC<{ card: CreditCardData }> = ({ card }) => (
    <div className={`p-6 rounded-2xl text-white shadow-lg h-52 bg-gradient-to-br ${card.gradient} relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
       
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full filter blur-xl opacity-50"></div>
        <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-white/5 rounded-full filter blur-xl opacity-50"></div>
        
        <div className="relative z-10 flex justify-between items-start">
            <p className="font-bold text-xl tracking-wider">{card.bankName}</p>
        </div>

        <div className="relative z-10 w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md flex justify-center items-center overflow-hidden">
            <div className="w-10 h-7 bg-yellow-900/20 rounded-sm border-2 border-yellow-400/50"></div>
        </div>
        
        <div className="relative z-10">
            <p className="font-mono text-xl tracking-widest text-center mb-2">{card.cardNumber}</p>
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs opacity-70 tracking-wider">CARDHOLDER NAME</p>
                    <p className="font-medium text-md">{card.cardholderName}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs opacity-70 tracking-wider">EXP</p>
                    <p className="font-medium text-md">{card.expiryDate}</p>
                </div>
            </div>
        </div>
    </div>
);

const TransactionHistory: React.FC<{ transactions: Transaction[], loading: boolean }> = ({ transactions, loading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 4;
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);
    const currentTransactions = transactions.slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage);
    
    return (
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Transaction History</h2>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
                    <input type="text" placeholder="Search..." className="bg-[var(--color-background)] rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none" />
                </div>
            </div>
            
            <table className="w-full text-left">
                <thead>
                    <tr className="text-[var(--color-text-secondary)] text-sm border-b border-[var(--color-border)]">
                        <th className="py-3 px-2">Nº</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">ID</th>
                        <th className="py-3 px-2">Transfer Type</th>
                        <th className="py-3 px-2">Description</th>
                        <th className="py-3 px-2">Amount</th>
                        <th className="py-3 px-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={7} className="text-center py-8 text-[var(--color-text-secondary)]">Loading...</td></tr>
                    ) : (
                        currentTransactions.map((t, index) => {
                            const isRevenue = t.amount > 0;
                            return (
                                <tr key={t._id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-variant)] transition-colors duration-150">
                                    <td className="py-4 px-2 text-sm">{((currentPage - 1) * transactionsPerPage) + index + 1}</td>
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${t.status === 'Paid' ? 'bg-[var(--color-accent-positive)]' : 'bg-[var(--color-accent-pending)]'}`}></div>
                                            <span className="text-sm">{t.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 font-mono text-sm">{t._id.slice(-8)}</td>
                                    <td className="py-4 px-2">{t.category}</td>
                                    <td className="py-4 px-2">{t.description || "N/A"}</td>
                                    <td className={`py-4 px-2 font-bold ${isRevenue ? 'text-[var(--color-accent-positive)]' : 'text-[var(--color-accent-negative)]'}`}>
                                        {isRevenue ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.amount)}
                                    </td>
                                    <td className="py-4 px-2 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
            
            <div className="flex justify-end items-center mt-4 space-x-2 text-sm">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-[var(--color-surface-variant)] disabled:opacity-50"><ChevronLeft size={16}/></button>
                <span className="font-bold">{currentPage}</span>
                <span>/</span>
                <span>{totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-[var(--color-surface-variant)] disabled:opacity-50"><ChevronRight size={16}/></button>
            </div>
        </div>
    );
};

const WalletPage: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ balance: 0, revenue: 0, expenses: 0 });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [statsRes, transRes] = await Promise.all([
                    axios.get('http://localhost:3001/api/transactions/stats'),
                    axios.get('http://localhost:3001/api/transactions'),
                ]);
                setStats(statsRes.data);
                if (transRes.data.data) {
                    setTransactions(transRes.data.data);
                }
            } catch (error) {
                toast.error("Failed to fetch wallet data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [user]);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <div className="flex-1 p-8 bg-[var(--color-background)]">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               
                <div className="lg:col-span-1 flex flex-col gap-8">
                    {mockCards.map(card => <CreditCard key={card.id} card={card} />)}
                </div>

                
                <div className="lg:col-span-3 space-y-8">
                    
                    <div className="bg-[var(--color-surface)] p-6 rounded-2xl">
                        <p className="text-[var(--color-text-secondary)] text-sm">Total balance</p>
                        <div className="flex items-center space-x-4 my-2">
                            <span className="text-3xl font-bold">{loading ? '...' : formatCurrency(stats.balance)}</span>
                            <div className="flex space-x-3 text-xs">
                                <span className="flex items-center space-x-1 text-[var(--color-accent-negative)]"><ArrowDown size={14}/> {formatCurrency(stats.expenses)}</span>
                                <span className="flex items-center space-x-1 text-[var(--color-accent-positive)]"><ArrowUp size={14}/> {formatCurrency(stats.revenue)}</span>
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-4">
                            <button className="flex-1 py-2.5 bg-[var(--color-primary)] text-white rounded-lg font-semibold shadow-md hover:opacity-90 flex items-center justify-center gap-2">
                                <ArrowUpRight size={18}/>
                                <span>Deposit</span>
                            </button>
                            <button className="flex-1 py-2.5 bg-[var(--color-surface-variant)] rounded-lg font-semibold border border-transparent hover:border-[var(--color-border)] flex items-center justify-center gap-2">
                                <ArrowDownLeft size={18}/>
                                <span>Withdraw</span>
                            </button>
                        </div>
                    </div>
                    
                    <TransactionHistory transactions={transactions} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
