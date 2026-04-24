require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Category = require('./models/Category');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    
    // Seed Categories
    const defaultCategories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Other'];
    try {
      const count = await Category.countDocuments();
      if (count === 0) {
        console.log('🌱 Seeding default categories...');
        await Category.insertMany(defaultCategories.map(name => ({ name })));
        console.log('✅ Categories seeded successfully!');
      } else {
        console.log('ℹ️ Categories already exist.');
      }
    } catch (err) {
      console.error('❌ Error seeding categories:', err);
    }
  })
  .catch(err => {
    console.error('❌ Could not connect to MongoDB:', err.message);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/transfers', require('./routes/transfers'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Global Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
