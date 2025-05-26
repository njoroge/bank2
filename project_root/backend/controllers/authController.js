const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Account = require('../models/Account'); // Import Account model
const { createAccountForUser } = require('./accountController'); // Import helper

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, accountNumber, pin, roles } = req.body;

  try {
    let user = await User.findOne({ accountNumber });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pin, salt);

    user = new User({
      firstName,
      lastName,
      accountNumber,
      pin: hashedPassword,
      roles: roles || { isCustomer: true }, // Default role
    });

    await user.save();

    // Create an account for the new user
    try {
      await createAccountForUser(user.id, user.accountNumber, 0); // Initial balance 0
    } catch (accountError) {
      // If account creation fails, we might want to roll back user creation or handle it
      // For now, log the error and send a specific response
      console.error('Account creation failed during registration:', accountError.message);
      // Optionally delete the user if account creation is critical
      // await User.findByIdAndDelete(user.id);
      return res.status(500).json({ msg: `User registered, but account creation failed: ${accountError.message}` });
    }

    const payload = {
      user: {
        id: user.id,
        roles: user.roles,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            accountNumber: user.accountNumber,
            roles: user.roles,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    // If user.save() failed due to duplicate key or other validation, it will be caught here.
    if (err.code === 11000 && err.keyPattern && err.keyPattern.accountNumber) {
        return res.status(400).json({ msg: 'Account number already in use by another user.' });
    }
    res.status(500).send('Server error during registration');
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { accountNumber, pin } = req.body;

  try {
    let user = await User.findOne({ accountNumber });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        roles: user.roles,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            accountNumber: user.accountNumber,
            roles: user.roles,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the authMiddleware.protect
    const user = await User.findById(req.user.id).select('-pin');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
