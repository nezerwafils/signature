const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Register
router.post(
  '/register',
  authLimiter,
  [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('email').optional().isEmail().withMessage('Must be a valid email')
  ],
  authController.register
);

// Login
router.post(
  '/login',
  authLimiter,
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  authController.login
);

// Get current user
router.get('/me', auth, authController.getCurrentUser);

// Update profile
router.put('/profile', auth, authController.updateProfile);

// Get user profile
router.get('/profile/:username', authController.getUserProfile);

module.exports = router;
