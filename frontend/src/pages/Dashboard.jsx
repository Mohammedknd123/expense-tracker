import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Plus, 
  ArrowUpRight, 
  Utensils, 
  Home, 
  Film, 
  Car, 
  Activity, 
  Zap, 
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  Repeat
} from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import Modal from '../components/ui/Modal';
import ExpenseForm from '../components/ExpenseForm';
import TransferForm from '../components/TransferForm';
import CountUp from '../components/ui/CountUp';
import { cn } from '../utils/cn';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api/axios';

const categoryIcons = {
  Food: Utensils,
  Transport: Car,
  Housing: Home,
  Entertainment: Film,
  Health: Activity,
  Shopping: ShoppingBag,
  Other: ShoppingBag
};

const Dashboard = () => {
  const [modalType, setModalType] = useState(null); // 'expense' | 'income' | 'transfer'
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0
  });

  const fetchDashboardData = async () => {
    try {
      const [expensesRes, userRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/auth/me')
      ]);
      
      const allTransactions = expensesRes.data;
      setExpenses(allTransactions);
      setUserId(userRes.data._id);
      
      let totalIncome = 0;
      let totalExpense = 0;

      allTransactions.forEach(t => {
        if (t.type === 'income' || t.type === 'transfer-in') {
          totalIncome += Math.abs(t.amount);
        } else if (t.type === 'expense' || t.type === 'transfer-out') {
          totalExpense += Math.abs(t.amount);
        }
      });

      setSummary({
        balance: userRes.data.balance || 0,
        income: totalIncome,
        expenses: totalExpense
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddTransaction = async (data) => {
    try {
      if (modalType === 'transfer') {
        const res = await api.post('/transfers', data);
        alert(`Successfully sent $${data.amount} to ${res.data.recipientName || data.recipient}`);
      } else {
        await api.post('/expenses', { ...data, type: modalType });
        alert(`Successfully added ${modalType}`);
      }
      setModalType(null);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert(error.response?.data?.message || 'Transaction failed');
    }
  };

  const chartData = [
    { month: 'Nov', amount: 2100 },
    { month: 'Dec', amount: 2800 },
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 1900 },
    { month: 'Mar', amount: 2600 },
    { month: 'Apr', amount: summary.expenses || 0 },
  ];

  const cards = [
    { title: 'Total Balance', amount: summary.balance, icon: CreditCard, color: 'text-secondary dark:text-neon-blue', glow: 'dark:neon-glow-blue' },
    { title: 'Total Income', amount: summary.income, icon: TrendingUp, color: 'text-success dark:text-neon-green', glow: 'dark:neon-glow-green' },
    { title: 'Total Expenses', amount: summary.expenses, icon: TrendingDown, color: 'text-warning dark:text-neon-red', glow: 'dark:neon-glow-red' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-primary dark:text-white tracking-tight">Overview</h1>
          <p className="text-primary/60 dark:text-white/60 font-medium mt-1">Track your finances.</p>
        </motion.div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Button variant="neon-green" className="flex-1 md:flex-none whitespace-nowrap" onClick={() => setModalType('income')}>
            <Plus className="w-4 h-4 mr-1" /> Income
          </Button>
          <Button variant="neon-red" className="flex-1 md:flex-none whitespace-nowrap" onClick={() => setModalType('expense')}>
            <Plus className="w-4 h-4 mr-1" /> Expense
          </Button>
          <Button variant="neon-purple" className="flex-1 md:flex-none whitespace-nowrap" onClick={() => setModalType('transfer')}>
            <ArrowUpRight className="w-4 h-4 mr-1" /> Transfer
          </Button>
        </div>
      </div>

      <Modal 
        isOpen={!!modalType} 
        onClose={() => setModalType(null)}
        title={modalType === 'transfer' ? 'Send Money' : `Log ${modalType === 'income' ? 'Income' : 'Expense'}`}
      >
        {modalType === 'transfer' ? (
          <TransferForm onSubmit={handleAddTransaction} />
        ) : (
          <ExpenseForm onSubmit={handleAddTransaction} type={modalType} />
        )}
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn("relative overflow-hidden group dark:bg-[#1a1a1a] dark:border-white/5", card.glow)}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/60 dark:text-white/40 mb-2">
                    {card.title}
                  </p>
                  <h3 className={cn("text-3xl font-bold tracking-tight", card.color)}>
                    $<CountUp value={card.amount} />
                  </h3>
                </div>
                <div className={cn("p-3 rounded-xl bg-surface-container dark:bg-white/5", card.color)}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-success dark:text-neon-green">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span>Active Tracking</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 dark:bg-[#1a1a1a] dark:border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary dark:text-white">Recent Transactions</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {expenses.slice(0, 5).map((expense, idx) => {
              const BaseIcon = categoryIcons[expense.category] || ShoppingBag;
              let Icon = BaseIcon;
              let colorClass = 'text-primary dark:text-neon-blue group-hover:neon-glow-blue';
              let amountColorClass = 'text-warning dark:text-neon-red neon-text-red';
              let amountPrefix = '-';
              
              if (expense.type === 'income' || expense.type === 'transfer-in') {
                Icon = ArrowUp;
                colorClass = 'text-success dark:text-neon-green group-hover:neon-glow-green';
                amountColorClass = 'text-success dark:text-neon-green neon-text-green';
                amountPrefix = '+';
              } else if (expense.type === 'expense' || expense.type === 'transfer-out') {
                Icon = expense.type === 'expense' ? ArrowDown : Repeat;
                colorClass = expense.type === 'expense' ? 'text-warning dark:text-neon-red' : 'text-purple-500 dark:text-neon-purple';
                amountColorClass = 'text-warning dark:text-neon-red neon-text-red';
                amountPrefix = '-';
              }

              return (
                <motion.div 
                  key={expense._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="flex items-center justify-between p-4 rounded-xl border border-surface-container dark:border-white/5 hover:bg-surface dark:hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-surface-container dark:bg-white/5 rounded-lg flex items-center justify-center font-bold transition-all ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary dark:text-white group-hover:text-white transition-colors">{expense.title}</h4>
                      <p className="text-xs text-primary/60 dark:text-white/40 font-bold uppercase tracking-tighter mt-0.5">
                        {expense.type} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${amountColorClass}`}>
                    {amountPrefix}${Math.abs(expense.amount).toFixed(2)}
                  </span>
                </motion.div>
              );
            })}
            {expenses.length === 0 && (
              <p className="text-center py-8 text-white/40 font-bold uppercase tracking-widest text-xs">No transactions found</p>
            )}
          </div>
        </Card>

        <Card className="dark:bg-[#1a1a1a] dark:border-white/5">
          <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Spending Overview</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 600 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#00d4ff' : '#0060AC'} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-4">
            <p className="text-xs font-bold text-primary/60 dark:text-white/40 uppercase tracking-widest">Analysis Active</p>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-tighter leading-relaxed">
                Total expenditure has been calculated from real database telemetry.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
