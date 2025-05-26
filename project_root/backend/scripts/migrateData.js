const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables from .env file in the backend directory
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

// Import Mongoose models
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// --- MySQL Configuration - USER MUST FILL THESE ---
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost', // or your MySQL host
  user: process.env.MYSQL_USER || 'root',      // your MySQL username
  password: process.env.MYSQL_PASSWORD || '',  // your MySQL password
  database: process.env.MYSQL_DATABASE || 'mysql_banking_db', // your MySQL database name
};
// --- End of MySQL Configuration ---

// --- MongoDB Configuration ---
const MONGO_URI = process.env.MONGO_URI;
// --- End of MongoDB Configuration ---


async function migrateData() {
  let mysqlConnection;
  let mongoConnection;

  try {
    // 1. Connect to MySQL
    console.log('Connecting to MySQL...');
    mysqlConnection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('MySQL connected successfully.');

    // 2. Connect to MongoDB
    console.log('Connecting to MongoDB...');
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is not defined in the .env file.");
    }
    mongoConnection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully.');

    // Clear existing data (optional, use with caution)
    console.log('Clearing existing MongoDB data (Users, Accounts, Transactions)...');
    await User.deleteMany({});
    await Account.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Existing MongoDB data cleared.');


    // 3. Fetch Data from MySQL
    console.log('Fetching data from MySQL tables...');
    const [mysqlUsers] = await mysqlConnection.execute('SELECT * FROM users');
    const [mysqlAccounts] = await mysqlConnection.execute('SELECT * FROM accounts');
    const [mysqlTransactions] = await mysqlConnection.execute('SELECT * FROM transactions');
    console.log(`Fetched ${mysqlUsers.length} users, ${mysqlAccounts.length} accounts, ${mysqlTransactions.length} transactions from MySQL.`);

    // 4. Transform and Insert Users into MongoDB
    console.log('Migrating Users...');
    const userMap = new Map(); // To map MySQL AccNo to MongoDB User._id for account linking

    for (const mysqlUser of mysqlUsers) {
      const roles = {
        isAdmin: !!mysqlUser.is_admin,
        isTeller: !!mysqlUser.is_teller,
        isClerk: !!mysqlUser.is_clerk,
        isCustomer: !!mysqlUser.is_customer,
      };
      // If no roles are true, default to isCustomer
      if (!roles.isAdmin && !roles.isTeller && !roles.isClerk && !roles.isCustomer) {
        roles.isCustomer = true;
      }

      const mongoUser = new User({
        firstName: mysqlUser.fname,
        lastName: mysqlUser.lname,
        accountNumber: mysqlUser.AccNo, // This will be unique
        pin: null, // PINs are not migrated directly
        requiresPinReset: true, // Flag for PIN reset
        roles: roles,
        createdAt: mysqlUser.date || new Date(), // Use MySQL date or current date
      });

      try {
        const savedUser = await mongoUser.save();
        userMap.set(mysqlUser.AccNo, savedUser._id); // Map MySQL AccNo to new MongoDB User _id
        console.log(`User ${savedUser.firstName} (AccNo: ${savedUser.accountNumber}) migrated.`);
      } catch (error) {
         if (error.code === 11000) { // Duplicate key error
            console.warn(`Skipping duplicate user with accountNumber: ${mysqlUser.AccNo}. It might already exist or accountNumber is not unique in source for different users.`);
            // Try to find existing user to map for accounts
            const existingUser = await User.findOne({ accountNumber: mysqlUser.AccNo });
            if (existingUser) {
                userMap.set(mysqlUser.AccNo, existingUser._id);
            }
        } else {
            console.error(`Error saving user ${mysqlUser.fname} (AccNo: ${mysqlUser.AccNo}):`, error.message);
        }
      }
    }
    console.log('Users migration completed.');

    // 5. Transform and Insert Accounts into MongoDB
    console.log('Migrating Accounts...');
    for (const mysqlAccount of mysqlAccounts) {
      const userId = userMap.get(mysqlAccount.AccNo); // Get MongoDB User _id using mapped AccNo
      if (!userId) {
        console.warn(`Skipping account for AccNo ${mysqlAccount.AccNo}: Corresponding user not found or not migrated.`);
        continue;
      }

      const mongoAccount = new Account({
        userId: userId,
        accountNumber: mysqlAccount.AccNo, // Same as user's accountNumber
        balance: mysqlAccount.balance,
        createdAt: mysqlAccount.date || new Date(),
      });
      
      try {
        await mongoAccount.save();
        console.log(`Account ${mongoAccount.accountNumber} migrated.`);
      } catch (error) {
        if (error.code === 11000) {
             console.warn(`Skipping duplicate account with accountNumber: ${mysqlAccount.AccNo}.`);
        } else {
            console.error(`Error saving account ${mysqlAccount.AccNo}:`, error.message);
        }
      }
    }
    console.log('Accounts migration completed.');

    // 6. Transform and Insert Transactions into MongoDB
    console.log('Migrating Transactions...');
    for (const mysqlTransaction of mysqlTransactions) {
      // Determine transaction type based on amount (simplified)
      // This is a very basic inference. Real systems might have more info.
      // For this schema, 'transactions' has 'amount' and 'balance'.
      // If the amount is positive, it's likely a deposit. If negative, a withdrawal.
      // However, the provided MySQL schema's `transactions` table has `amount` which seems to be the value of the transaction itself, not a delta.
      // And `balance` is the balance *after* the transaction.
      // We need to infer the type. If the previous transaction for this account had a balance B_prev,
      // and current transaction amount is A and balance is B_curr.
      // If B_curr = B_prev + A, it's a deposit of A.
      // If B_curr = B_prev - A, it's a withdrawal of A.
      // This requires ordering and looking up previous transactions, which is complex for a simple script.
      // Let's use a simpler approach based on the problem description: "legacy_record".
      
      // Find the corresponding MongoDB user to ensure the account exists (optional strict check)
      const userForTx = await User.findOne({accountNumber: mysqlTransaction.AccNo});
      if (!userForTx) {
          console.warn(`Skipping transaction for AccNo ${mysqlTransaction.AccNo}: User/Account not found in MongoDB.`);
          continue;
      }

      const mongoTransaction = new Transaction({
        accountNumber: mysqlTransaction.AccNo,
        type: 'legacy_record', // Generic type as per problem description
        amount: mysqlTransaction.amount, // Assuming amount is the transactional value
        balanceAfterTransaction: mysqlTransaction.balance,
        description: `Legacy transaction record (ID: ${mysqlTransaction.id})`, // Add MySQL tx ID for reference
        createdAt: mysqlTransaction.date || new Date(),
      });
      
      try {
        await mongoTransaction.save();
        console.log(`Transaction for AccNo ${mongoTransaction.accountNumber} (MySQL ID: ${mysqlTransaction.id}) migrated.`);
      } catch (error) {
        console.error(`Error saving transaction for AccNo ${mysqlTransaction.AccNo} (MySQL ID: ${mysqlTransaction.id}):`, error.message);
      }
    }
    console.log('Transactions migration completed.');

    console.log('Data migration successful!');

  } catch (error) {
    console.error('Data migration failed:', error);
  } finally {
    // 7. Close connections
    if (mysqlConnection) {
      await mysqlConnection.end();
      console.log('MySQL connection closed.');
    }
    if (mongoConnection) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    }
  }
}

// Run the migration
migrateData();
