const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('firstName', 'First name is required').not().isEmpty(),
    body('lastName', 'Last name is required').not().isEmpty(),
    body('accountNumber', 'Account number is required').not().isEmpty(),
    body('pin', 'PIN is required and must be at least 6 characters').isLength({ min: 6 }),
  ],
  registerUser
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('accountNumber', 'Account number is required').not().isEmpty(),
    body('pin', 'PIN is required').exists(),
  ],
  loginUser
);

// @route   GET /api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', protect, getMe);

module.exports = router;
