import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Utensils, Home, Film, Car, Activity, Zap, ShoppingBag, ArrowUp, ArrowDown, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/ui/Modal';
import ExpenseForm from '../components/ExpenseForm';
import { cn } from '../utils/cn';
import api from '../api/axios';

const categoryIcons = {
  Food: Utensils,
  Transport: Car,
  Housing: Home,
  Entertainment: Film,
  Health: Activity,
  Utilities: Zap,
  Shopping: ShoppingBag,
  Other: ShoppingBag
};

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState(null);
  const [filterType, setFilterType] = useState('All'); // 'All' | 'income' | 'expense' | 'transfer'
  const filterTabs = ['All', 'income', 'expense', 'transfer-out', 'transfer-in'];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  const fetchLedgerData = async () => {
    try {
      const [expensesRes, userRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/auth/me')
      ]);
      setExpenses(expensesRes.data);
      setUserId(userRes.data._id);
    } catch (error) {
      console.error('Failed to fetch ledger data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(['All', ...response.data.map(c => c.name)]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchLedgerData();
  }, []);

  const handleAddOrUpdate = async (data) => {
    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense._id}`, data);
      } else {
        await api.post('/expenses', data);
      }
      setIsModalOpen(false);
      setEditingExpense(null);
      fetchLedgerData();
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchLedgerData();
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
    }
  };

  const filteredExpenses = (expenses || []).filter(e => 
    (filterType === 'All' || e.type === filterType) &&
    (e.title || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-primary dark:text-white tracking-tight">Ledger</h1>
          <p className="text-primary/60 dark:text-white/60 font-medium mt-1">Granular transaction telemetry.</p>
        </motion.div>
        <Button variant="neon" onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Log Transaction
        </Button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Edit Transaction' : 'New Transaction'}
      >
        <ExpenseForm 
          initialData={editingExpense || {}} 
          onSubmit={handleAddOrUpdate} 
        />
      </Modal>

      <Card className="p-4 dark:bg-[#1a1a1a] dark:border-white/5 bg-opacity-50 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-neon-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search ledger..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container dark:bg-white/5 border border-transparent focus:border-secondary dark:focus:border-neon-blue rounded-lg text-sm focus:ring-4 focus:ring-secondary/10 dark:focus:ring-neon-blue/10 focus:outline-none transition-all dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  filterType === tab 
                    ? "bg-primary text-white dark:bg-neon-blue dark:text-black dark:neon-glow-blue" 
                    : "bg-surface-container text-primary/60 dark:bg-white/5 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/10"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0 dark:bg-[#1a1a1a] border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container dark:bg-white/5 text-primary/60 dark:text-white/40 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container dark:divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredExpenses.map((expense, idx) => {
                  const BaseIcon = categoryIcons[expense.category] || ShoppingBag;
                  let Icon = BaseIcon;
                  let colorClass = 'text-primary dark:text-white group-hover:neon-text-blue';
                  let iconColorClass = 'text-primary/40 dark:text-white/20 group-hover:text-neon-blue';
                  let amountColorClass = 'text-warning dark:text-neon-red neon-text-red';
                  let amountPrefix = '-';
                  let displayTitle = expense.title;
                  
                  if (expense.type === 'income' || expense.type === 'transfer-in') {
                    Icon = ArrowUp;
                    colorClass = 'text-success dark:text-neon-green group-hover:text-neon-green';
                    iconColorClass = 'text-success/50 dark:text-neon-green/50 group-hover:text-neon-green';
                    amountColorClass = 'text-success dark:text-neon-green neon-text-green';
                    amountPrefix = '+';
                    if (expense.type === 'transfer-in') {
                      displayTitle = `Received from ${expense.sender?.name || 'User'}`;
                    }
                  } else if (expense.type === 'expense' || expense.type === 'transfer-out') {
                    Icon = expense.type === 'expense' ? ArrowDown : Repeat;
                    colorClass = expense.type === 'expense' ? 'text-primary dark:text-white' : 'text-purple-500 dark:text-neon-purple';
                    iconColorClass = expense.type === 'expense' ? 'text-primary/40 dark:text-white/20' : 'text-purple-500/50 dark:text-neon-purple/50';
                    amountColorClass = 'text-warning dark:text-neon-red neon-text-red';
                    amountPrefix = '-';
                    if (expense.type === 'transfer-out') {
                      displayTitle = `Sent to ${expense.recipient?.name || 'User'}`;
                    }
                  }

                  return (
                    <motion.tr 
                      key={expense._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-surface dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 transition-colors ${iconColorClass}`} />
                          <span className={`font-bold transition-colors ${colorClass}`}>{displayTitle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-secondary/10 dark:bg-white/5 text-secondary dark:text-white/60 text-[10px] font-bold rounded uppercase border border-secondary/20 dark:border-white/10">
                          {expense.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-primary/70 dark:text-white/60">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold ${amountColorClass}`}>
                          {amountPrefix}${Math.abs(expense.amount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!['transfer', 'transfer-in', 'transfer-out'].includes(expense.type) ? (
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => { setEditingExpense(expense); setIsModalOpen(true); }}
                              className="p-1.5 text-primary/40 dark:text-white/20 hover:text-secondary dark:hover:text-neon-blue transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(expense._id)}
                              className="p-1.5 text-primary/40 dark:text-white/20 hover:text-warning dark:hover:text-neon-red transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-[10px] uppercase font-bold text-white/20 tracking-widest">
                            Locked
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-surface-container dark:border-white/5 flex items-center justify-between bg-surface dark:bg-black/20">
          <p className="text-xs font-bold text-primary/60 dark:text-white/40 uppercase tracking-tighter">
            Total ledger entries: {filteredExpenses.length}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="p-1 h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="p-1 h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Expenses;
