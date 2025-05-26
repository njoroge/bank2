# Data Migration Script (MySQL to MongoDB)

## Purpose

The `migrateData.js` script is designed to migrate data from a legacy MySQL banking database to the new MongoDB database used by this MERN application. It handles the transformation of users, accounts, and transaction records from the MySQL schema to the MongoDB schema.

## Prerequisites

1.  **Node.js and npm:** Ensure you have Node.js and npm installed.
2.  **MongoDB Server:** Your MongoDB instance should be running and accessible.
3.  **MySQL Server:** Your MySQL instance with the legacy banking data should be running and accessible.
4.  **Backend Dependencies:** You need to install the backend dependencies first. Navigate to the `backend` directory and run:
    ```bash
    cd /path/to/your/project/project_root/backend
    npm install
    ```
    This will install Mongoose, mysql2, dotenv, and other necessary packages.

## Configuration

Before running the migration script, you **MUST** configure your database credentials:

1.  **MongoDB Configuration:**
    *   The script uses the `MONGO_URI` from the `project_root/backend/.env` file. Ensure this is correctly set up to point to your target MongoDB database.

2.  **MySQL Configuration (CRITICAL):**
    *   Open the `project_root/backend/scripts/migrateData.js` file.
    *   Locate the `MYSQL_CONFIG` section within the script:
        ```javascript
        // --- MySQL Configuration - USER MUST FILL THESE ---
        const MYSQL_CONFIG = {
          host: process.env.MYSQL_HOST || 'localhost', // or your MySQL host
          user: process.env.MYSQL_USER || 'root',      // your MySQL username
          password: process.env.MYSQL_PASSWORD || '',  // your MySQL password
          database: process.env.MYSQL_DATABASE || 'mysql_banking_db', // your MySQL database name
        };
        // --- End of MySQL Configuration ---
        ```
    *   **Option 1 (Recommended for sensitive data): Use Environment Variables:**
        *   Create or update your `project_root/backend/.env` file with your MySQL credentials:
            ```env
            MYSQL_HOST=your_mysql_host
            MYSQL_USER=your_mysql_username
            MYSQL_PASSWORD=your_mysql_password
            MYSQL_DATABASE=your_mysql_database_name
            ```
        *   The script will automatically pick these up.
    *   **Option 2: Hardcode (Less Secure, for local testing only):**
        *   Directly replace the placeholder values in the `MYSQL_CONFIG` object within `migrateData.js`:
            ```javascript
            const MYSQL_CONFIG = {
              host: 'your_mysql_host',
              user: 'your_mysql_username',
              password: 'your_mysql_password',
              database: 'your_mysql_database_name',
            };
            ```
        *   **Remember to remove hardcoded credentials before committing any code.**

## PIN Migration Strategy

*   User PINs from the MySQL database **are NOT migrated directly** for security reasons and because they are likely stored in a format incompatible with the new system's bcrypt hashing.
*   Migrated user accounts will have their `pin` field set to `null` and a `requiresPinReset: true` flag.
*   Users will need to set a new PIN when they first log in to the MERN application. This might involve:
    *   A "Forgot PIN" / "Reset PIN" feature (to be implemented in the MERN app).
    *   Admins providing temporary PINs or a reset link.

## Running the Script

1.  Ensure all configurations in the `backend/.env` file (for MongoDB) and directly in `migrateData.js` or `.env` (for MySQL) are correct.
2.  Navigate to the project's root directory in your terminal.
3.  Execute the script using Node.js:
    ```bash
    node project_root/backend/scripts/migrateData.js
    ```
4.  Observe the console logs for progress and any error messages. The script will output information about connections, data fetching, and the migration process for each data type.

## Important Notes

*   **Data Clearing:** The script, by default, will attempt to clear existing data from the `users`, `accounts`, and `transactions` collections in your MongoDB database before starting the migration. This is to prevent duplicate entries if the script is run multiple times.
    *   **USE WITH CAUTION, especially on production data.**
    *   You can comment out or modify the `deleteMany({})` calls in the script if you have a different data handling strategy.
*   **Error Handling:** The script includes basic error handling. If critical errors occur (e.g., inability to connect to databases), the script will log the error and attempt to close any open connections before exiting. Individual record migration errors are logged, and the script attempts to continue with other records where possible.
*   **Idempotency:** While the script clears data to avoid simple duplicates on reruns, complex relationships or partial failures might require manual intervention or more sophisticated idempotency logic if you need to run the script multiple times on an already partially migrated database.
*   **Backup:** Always back up both your MySQL and MongoDB databases before running any migration script.
*   **MySQL Schema:** The script assumes a MySQL schema with tables named `users`, `accounts`, and `transactions` and specific column names as referenced in the script (e.g., `fname`, `lname`, `AccNo`, `is_admin`, etc.). Adjust the SQL queries and data mapping in the script if your MySQL schema differs.
*   **Transaction Type Inference:** The migration script assigns a generic type `legacy_record` to all migrated transactions. The description field includes the original MySQL transaction ID for reference.

This script provides a foundational way to move your data. Depending on the complexity and specific needs of your legacy system, further customization might be required.
