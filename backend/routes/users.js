const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/users/search
// @desc    Search users by name or email
router.get('/search', auth, async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json([]);
  }

  try {
    // Case-insensitive search on name or email
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user.id } // Exclude the current user
    })
    .select('-password -balance')
    .limit(10);

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
