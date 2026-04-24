import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { Send } from 'lucide-react';

const TransferForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    amount: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.recipientEmail) {
      alert("Please enter a recipient email.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Recipient Email"
          name="recipientEmail"
          type="email"
          value={formData.recipientEmail}
          onChange={handleChange}
          placeholder="e.g. user@example.com"
          required
        />

        <Input
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
        />

        <Input
          label="Note (Optional)"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What's this for?"
        />
      </div>

      <Button type="submit" variant="neon-purple" className="w-full h-12 text-sm">
        <Send className="w-4 h-4 mr-2" />
        Send Money
      </Button>
    </form>
  );
};

export default TransferForm;
