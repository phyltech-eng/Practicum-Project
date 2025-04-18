const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Route Example
router.get('/profile', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
