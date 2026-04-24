const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Expense = require('../models/Expense');

// @route   POST api/transfers
// @desc    Transfer money between users
router.post('/', auth, async (req, res) => {
  const { recipientEmail, amount, description } = req.body;
  const transferAmount = Number(amount);

  if (!recipientEmail || !transferAmount || transferAmount <= 0) {
    return res.status(400).json({ message: 'Invalid transfer details' });
  }

  try {
    const sender = await User.findById(req.user.id);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Find recipient by email
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found with this email' });
    }

    console.log('Sender ID:', sender._id.toString());
    console.log('Sender email:', sender.email);
    console.log('Recipient ID:', recipient._id.toString());
    console.log('Recipient email:', recipient.email);

    if (recipient.email.toLowerCase() === sender.email.toLowerCase()) {
      return res.status(400).json({ message: 'Cannot transfer money to yourself' });
    }

    // Check sender has enough balance
    if (sender.balance < transferAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct from sender
    sender.balance -= transferAmount;
    await sender.save();

    // Add to recipient
    recipient.balance += transferAmount;
    await recipient.save();

    // Create sender's transaction (deduction)
    const senderTransaction = new Expense({
      title: `Transfer to ${recipient.name}`,
      amount: -transferAmount, // Negative for sender
      category: 'Transfer',
      date: new Date(),
      description: description || `Sent to ${recipient.name}`,
      type: 'transfer-out',
      recipient: recipient._id,
      userId: sender._id
    });
    await senderTransaction.save();

    // Create recipient's transaction (addition)
    const recipientTransaction = new Expense({
      title: `Transfer from ${sender.name}`,
      amount: transferAmount, // Positive for recipient
      category: 'Transfer',
      date: new Date(),
      description: description || `Received from ${sender.name}`,
      type: 'transfer-in',
      sender: sender._id,
      userId: recipient._id
    });
    await recipientTransaction.save();

    res.json({ 
      message: 'Transfer successful', 
      newBalance: sender.balance,
      recipientName: recipient.name 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
