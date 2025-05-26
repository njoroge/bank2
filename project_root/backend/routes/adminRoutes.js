const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createUser,
  listUsers,
  getUserById,
  updateUserRoles,
  listAllAccounts,
  getAccountByNumberAdmin,
  listAllTransactions,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes in this file and ensure only admins can access them
router.use(protect);
router.use(authorize('isAdmin')); // Ensures only users with isAdmin=true can access

// User Management Routes
// @route   POST /api/admin/users
// @desc    Admin creates a new user
// @access  Private (Admin)
router.post(
  '/users',
  [
    body('firstName', 'First name is required').not().isEmpty(),
    body('lastName', 'Last name is required').not().isEmpty(),
    body('accountNumber', 'Account number is required').not().isEmpty(),
    body('pin', 'PIN is required and must be at least 6 characters').isLength({ min: 6 }),
    body('roles', 'Roles object is required').optional().isObject(), // Optional, defaults in controller
    body('roles.isAdmin', 'isAdmin role must be a boolean').optional().isBoolean(),
    body('roles.isTeller', 'isTeller role must be a boolean').optional().isBoolean(),
    body('roles.isClerk', 'isClerk role must be a boolean').optional().isBoolean(),
    body('roles.isCustomer', 'isCustomer role must be a boolean').optional().isBoolean(),
  ],
  createUser
);

// @route   GET /api/admin/users
// @desc    Admin lists all users with pagination
// @access  Private (Admin)
router.get(
  '/users',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt(),
  ],
  listUsers
);

// @route   GET /api/admin/users/:identifier
// @desc    Admin gets a user by ID or Account Number
// @access  Private (Admin)
router.get(
  '/users/:identifier',
  [param('identifier', 'User identifier (ID or Account Number) is required').not().isEmpty()],
  getUserById
);

// @route   PUT /api/admin/users/:userId/roles
// @desc    Admin updates user roles
// @access  Private (Admin)
router.put(
  '/users/:userId/roles',
  [
    param('userId', 'User ID is required').isMongoId(),
    body('roles', 'Roles object is required').isObject(),
    body('roles.isAdmin', 'isAdmin role must be a boolean').optional().isBoolean(),
    body('roles.isTeller', 'isTeller role must be a boolean').optional().isBoolean(),
    body('roles.isClerk', 'isClerk role must be a boolean').optional().isBoolean(),
    body('roles.isCustomer', 'isCustomer role must be a boolean').optional().isBoolean(),
  ],
  updateUserRoles
);

// Account Management Routes
// @route   GET /api/admin/accounts
// @desc    Admin lists all accounts with pagination
// @access  Private (Admin)
router.get(
  '/accounts',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt(),
  ],
  listAllAccounts
);

// @route   GET /api/admin/accounts/:accountNumber
// @desc    Admin gets account by Account Number
// @access  Private (Admin)
router.get(
  '/accounts/:accountNumber',
  [param('accountNumber', 'Account number is required').not().isEmpty()],
  getAccountByNumberAdmin
);

// Transaction Management Routes
// @route   GET /api/admin/transactions
// @desc    Admin lists all transactions with pagination and filtering
// @access  Private (Admin)
router.get(
  '/transactions',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt(),
    query('type').optional().isString().isIn(['deposit', 'withdrawal', 'transfer']),
    query('startDate').optional().isISO8601().toDate(),
    query('endDate').optional().isISO8601().toDate(),
    query('accountNumber').optional().isString(),
  ],
  listAllTransactions
);

module.exports = router;
