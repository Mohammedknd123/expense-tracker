const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// @route   GET api/categories
// @desc    Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

module.exports = router;
