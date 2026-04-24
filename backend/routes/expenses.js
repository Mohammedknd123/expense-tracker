const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const User = require('../models/User');

// @route   GET api/expenses
// @desc    Get all user expenses
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/expenses
// @desc    Create an expense
router.post('/', auth, async (req, res) => {
  const { title, amount, category, date, description, type = 'expense' } = req.body;

  try {
    const newExpense = new Expense({
      title,
      amount: Number(amount),
      category,
      date,
      description,
      type,
      userId: req.user.id
    });

    const expense = await newExpense.save();

    // Update user balance
    const user = await User.findById(req.user.id);
    if (user) {
      if (type === 'income') {
        user.balance += Number(amount);
      } else if (type === 'expense') {
        user.balance -= Number(amount);
      }
      await user.save();
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/expenses/:id
// @desc    Update an expense
router.put('/:id', auth, async (req, res) => {
  const { title, amount, category, date, description, type = 'expense' } = req.body;

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: 'Transaction not found' });

    // Make sure user owns expense
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Transfers cannot be edited
    if (expense.type === 'transfer' || type === 'transfer') {
      return res.status(400).json({ message: 'Transfers cannot be edited manually' });
    }

    const oldAmount = expense.amount;
    const oldType = expense.type;

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: { title, amount: Number(amount), category, date, description, type } },
      { new: true }
    ).populate('sender', 'name email').populate('recipient', 'name email');

    // Update user balance
    const user = await User.findById(req.user.id);
    if (user) {
      // Revert old impact
      if (oldType === 'income') user.balance -= oldAmount;
      else if (oldType === 'expense') user.balance += oldAmount;

      // Apply new impact
      if (type === 'income') user.balance += Number(amount);
      else if (type === 'expense') user.balance -= Number(amount);

      await user.save();
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/expenses/:id
// @desc    Delete an expense
router.delete('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: 'Transaction not found' });

    // Make sure user owns expense
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (expense.type === 'transfer') {
      return res.status(400).json({ message: 'Transfers cannot be deleted manually' });
    }

    const oldAmount = expense.amount;
    const oldType = expense.type;

    await Expense.findByIdAndDelete(req.params.id);

    // Update user balance
    const user = await User.findById(req.user.id);
    if (user) {
      if (oldType === 'income') user.balance -= oldAmount;
      else if (oldType === 'expense') user.balance += oldAmount;
      await user.save();
    }

    res.json({ message: 'Transaction removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
