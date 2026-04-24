import React, { useState, useEffect } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import api from '../api/axios';

const ExpenseForm = ({ onSubmit, initialData = {}, type = 'expense' }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    amount: initialData.amount || '',
    category: initialData.category || '',
    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: initialData.description || '',
    type: initialData.type || type,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
        if (!formData.category && response.data.length > 0) {
          setFormData(prev => ({ ...prev, category: response.data[0].name }));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Transaction Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g. Weekly Groceries"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount ($)"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
        
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full h-11 rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-blue transition-all"
            required
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">Description (Optional)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full min-h-[100px] rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-blue transition-all"
          placeholder="Add some context..."
        />
      </div>

      <Button type="submit" variant={type === 'income' ? 'neon-green' : 'neon-red'} className="w-full h-12 mt-4">
        {initialData._id ? 'Update Transaction' : `Log ${type === 'income' ? 'Income' : 'Expense'}`}
      </Button>
    </form>
  );
};

export default ExpenseForm;
