const Account = require('../models/Account');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

// @desc    Create a new account (Helper function, can be called internally)
// @access  Private/System
exports.createAccountForUser = async (userId, accountNumber, initialBalance = 0) => {
  try {
    // Check if an account with this account number already exists
    let account = await Account.findOne({ accountNumber });
    if (account) {
      throw new Error(`Account with number ${accountNumber} already exists.`);
    }

    // Check if this user already has an account (optional, based on business logic)
    // For this implementation, we assume one user can have multiple accounts if accountNumbers are different
    // but a single accountNumber must be unique across all accounts.

    account = new Account({
      userId,
      accountNumber,
      balance: initialBalance,
    });

    await account.save();
    return account;
  } catch (err) {
    console.error('Error creating account:', err.message);
    throw err; // Re-throw the error to be handled by the caller
  }
};


// @desc    Create a new account (Route handler, if called via API directly)
// @route   POST /api/accounts
// @access  Private (e.g., Admin)
exports.createAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, accountNumber, initialBalance } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const account = await exports.createAccountForUser(userId, accountNumber, initialBalance);
    res.status(201).json({ msg: 'Account created successfully', account });

  } catch (err) {
    console.error(err.message);
    // Check for specific error messages from createAccountForUser
    if (err.message.includes("already exists")) {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server error during account creation');
  }
};

// @desc    Get account details for the logged-in user
// @route   GET /api/accounts/my-account
// @access  Private (Customer, Teller, Admin)
exports.getAccountDetails = async (req, res) => {
  try {
    // req.user.id is from the protect middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Assuming the user's primary account number is stored in their User document
    // Or, if a user can have multiple accounts, this logic would need adjustment
    // For now, let's assume one primary account linked in User schema or find one by userId
    const account = await Account.findOne({ accountNumber: user.accountNumber }).populate('userId', 'firstName lastName email'); // Or .findOne({ userId: req.user.id })

    if (!account) {
      return res.status(404).json({ msg: 'Account not found for this user' });
    }

    res.json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Deposit funds into an account
// @route   POST /api/accounts/deposit
// @access  Private (Customer to their own, Teller/Admin to any)
exports.deposit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { accountNumber, amount } = req.body;
  const depositAmount = parseFloat(amount);

  if (depositAmount <= 0) {
    return res.status(400).json({ msg: 'Deposit amount must be positive' });
  }

  try {
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ msg: 'Account not found' });
    }

    // Authorization: Check if the logged-in user can deposit to this account
    // A customer can only deposit to their own account.
    // Teller/Admin can deposit to any account.
    const loggedInUser = await User.findById(req.user.id);
    if (loggedInUser.roles.isCustomer && account.accountNumber !== loggedInUser.accountNumber) {
        return res.status(403).json({ msg: 'Forbidden: Customers can only deposit to their own account.' });
    }


    account.balance += depositAmount;
    
    const transaction = new Transaction({
      accountNumber: account.accountNumber,
      type: 'deposit',
      amount: depositAmount,
      balanceAfterTransaction: account.balance,
      description: req.body.description || 'Cash Deposit',
    });

    await account.save();
    await transaction.save();

    res.json({
      msg: 'Deposit successful',
      accountBalance: account.balance,
      transaction,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Withdraw funds from an account
// @route   POST /api/accounts/withdraw
// @access  Private (Customer from their own, Teller/Admin from any)
exports.withdraw = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { accountNumber, amount } = req.body;
  const withdrawalAmount = parseFloat(amount);

  if (withdrawalAmount <= 0) {
    return res.status(400).json({ msg: 'Withdrawal amount must be positive' });
  }

  try {
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ msg: 'Account not found' });
    }

    // Authorization: Check if the logged-in user can withdraw from this account
    const loggedInUser = await User.findById(req.user.id);
     if (loggedInUser.roles.isCustomer && account.accountNumber !== loggedInUser.accountNumber) {
        return res.status(403).json({ msg: 'Forbidden: Customers can only withdraw from their own account.' });
    }

    if (account.balance < withdrawalAmount) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }

    account.balance -= withdrawalAmount;

    const transaction = new Transaction({
      accountNumber: account.accountNumber,
      type: 'withdrawal',
      amount: withdrawalAmount,
      balanceAfterTransaction: account.balance,
      description: req.body.description || 'Cash Withdrawal',
    });

    await account.save();
    await transaction.save();

    res.json({
      msg: 'Withdrawal successful',
      accountBalance: account.balance,
      transaction,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get transactions for an account
// @route   GET /api/accounts/:accountNumber/transactions
// @access  Private (Owner, Teller, Admin)
exports.getTransactions = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ msg: 'Account not found' });
    }
    
    // Authorization: User can see their own, Admin/Teller might see others.
    const loggedInUser = await User.findById(req.user.id);
    if (loggedInUser.roles.isCustomer && account.accountNumber !== loggedInUser.accountNumber) {
        return res.status(403).json({ msg: 'Forbidden: Customers can only view transactions for their own account.' });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ accountNumber })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions = await Transaction.countDocuments({ accountNumber });

    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
