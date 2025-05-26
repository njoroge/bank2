const express = require('express');
const { body, param } = require('express-validator');
const {
  createAccount,
  getAccountDetails,
  deposit,
  withdraw,
  getTransactions,
} = require('../controllers/accountController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes in this file are protected by default
router.use(protect);

// @route   POST /api/accounts
// @desc    Create a new account (for a specific user, e.g., by Admin)
// @access  Private (Admin)
router.post(
  '/',
  authorize('isAdmin'), // Only admins can create accounts directly via this route
  [
    body('userId', 'User ID is required').not().isEmpty().isMongoId(),
    body('accountNumber', 'Account number is required').not().isEmpty(),
    body('initialBalance', 'Initial balance must be a number').optional().isNumeric(),
  ],
  createAccount
);

// @route   GET /api/accounts/my-account
// @desc    Get account details for the logged-in user
// @access  Private (Customer, Teller, Admin)
router.get('/my-account', getAccountDetails); // Any authenticated user can get their own account details

// @route   POST /api/accounts/deposit
// @desc    Deposit funds
// @access  Private (Customer to their own, Teller/Admin to any)
router.post(
  '/deposit',
  [
    body('accountNumber', 'Account number is required').not().isEmpty(),
    body('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
    body('description', 'Description is optional').optional().isString(),
  ],
  deposit 
  // Authorization logic is within the controller:
  // Customers can only deposit to their own account.
  // Tellers/Admins can deposit to any account.
);

// @route   POST /api/accounts/withdraw
// @desc    Withdraw funds
// @access  Private (Customer from their own, Teller/Admin from any)
router.post(
  '/withdraw',
  [
    body('accountNumber', 'Account number is required').not().isEmpty(),
    body('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
    body('description', 'Description is optional').optional().isString(),
  ],
  withdraw
  // Authorization logic is within the controller:
  // Customers can only withdraw from their own account.
  // Tellers/Admins can withdraw from any account.
);

// @route   GET /api/accounts/:accountNumber/transactions
// @desc    Get transactions for a specific account
// @access  Private (Owner, Teller, Admin)
router.get(
  '/:accountNumber/transactions',
  [param('accountNumber', 'Account number is required').not().isEmpty()],
  getTransactions
  // Authorization logic is within the controller:
  // Customers can only view their own account transactions.
  // Tellers/Admins can view any account's transactions.
);

module.exports = router;
