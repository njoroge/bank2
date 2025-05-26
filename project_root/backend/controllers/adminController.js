const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { createAccountForUser } = require('./accountController'); // Helper from accountController

// @desc    Admin: Create a new user with specific roles
// @route   POST /api/admin/users
// @access  Private (Admin)
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, accountNumber, pin, roles } = req.body;

  try {
    let user = await User.findOne({ accountNumber });
    if (user) {
      return res.status(400).json({ msg: 'User with this account number already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pin, salt);

    user = new User({
      firstName,
      lastName,
      accountNumber,
      pin: hashedPassword,
      roles: roles || { isCustomer: true }, // Default to customer if no roles specified
    });

    await user.save();

    // Create an associated account for the new user
    try {
      await createAccountForUser(user.id, user.accountNumber, 0); // Initial balance 0
    } catch (accountError) {
      // Rollback user creation if account creation fails
      await User.findByIdAndDelete(user.id);
      console.error('Account creation failed for admin-created user:', accountError.message);
      return res.status(500).json({ msg: `User creation failed during account setup: ${accountError.message}` });
    }

    const userResponse = user.toObject();
    delete userResponse.pin; // Exclude PIN from response

    res.status(201).json({ msg: 'User created successfully by admin', user: userResponse });

  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) { // Mongoose duplicate key error for accountNumber
        return res.status(400).json({ msg: 'Account number already in use.' });
    }
    res.status(500).send('Server error during user creation');
  }
};

// @desc    Admin: List all users with pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.listUsers = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find().select('-pin').skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Admin: Get user by ID or Account Number
// @route   GET /api/admin/users/:identifier
// @access  Private (Admin)
exports.getUserById = async (req, res) => {
  try {
    const { identifier } = req.params;
    let user;

    // Check if identifier is a valid MongoDB ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier).select('-pin');
    } else {
      // Assume it's an accountNumber
      user = await User.findOne({ accountNumber: identifier }).select('-pin');
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Admin: Update user roles
// @route   PUT /api/admin/users/:userId/roles
// @access  Private (Admin)
exports.updateUserRoles = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { userId } = req.params; // This should be the User's MongoDB ID
    const { roles } = req.body;

    if (!roles || typeof roles !== 'object') {
        return res.status(400).json({ msg: 'Invalid roles object provided.' });
    }
    // Ensure no non-role fields are passed, or sanitize roles object.
    const validRoles = {
        isAdmin: roles.isAdmin === true,
        isTeller: roles.isTeller === true,
        isClerk: roles.isClerk === true,
        isCustomer: roles.isCustomer === true
    };


    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { roles: validRoles } },
      { new: true, runValidators: true }
    ).select('-pin');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User roles updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Admin: List all accounts with pagination
// @route   GET /api/admin/accounts
// @access  Private (Admin)
exports.listAllAccounts = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const accounts = await Account.find()
      .populate('userId', 'firstName lastName accountNumber email') // Populate user details
      .skip(skip)
      .limit(limit);
    const totalAccounts = await Account.countDocuments();

    res.json({
      accounts,
      currentPage: page,
      totalPages: Math.ceil(totalAccounts / limit),
      totalAccounts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Admin: Get account by Account Number
// @route   GET /api/admin/accounts/:accountNumber
// @access  Private (Admin)
exports.getAccountByNumberAdmin = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const account = await Account.findOne({ accountNumber }).populate('userId', 'firstName lastName email');

    if (!account) {
      return res.status(404).json({ msg: 'Account not found' });
    }
    res.json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Admin: List all transactions with pagination and optional filtering
// @route   GET /api/admin/transactions
// @access  Private (Admin)
exports.listAllTransactions = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const { type, startDate, endDate, accountNumber } = req.query;
  let filter = {};

  if (type) filter.type = type;
  if (accountNumber) filter.accountNumber = accountNumber;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  try {
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalTransactions = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
      filterApplied: filter
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
