const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  type: { type: String, enum: ['expense', 'income', 'transfer', 'transfer-out', 'transfer-in'], default: 'expense' },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
