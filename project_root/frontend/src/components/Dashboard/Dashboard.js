import React, { useState, useEffect, useCallback } from 'react';
import AccountSummary from './AccountSummary';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm'; // New component for deposit/withdrawal
import { useAuth } from '../../context/useAuth';
import axiosInstance from '../../api/axiosInstance';

const Dashboard = () => {
  const { user } = useAuth(); // Get the logged-in user
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [errorAccount, setErrorAccount] = useState('');
  const [errorTransactions, setErrorTransactions] = useState('');
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionTotalPages, setTransactionTotalPages] = useState(1);

  const fetchAccountDetails = useCallback(async () => {
    if (!user?.accountNumber) return; // Should not happen if user is loaded

    setLoadingAccount(true);
    setErrorAccount('');
    try {
      // The /my-account endpoint should ideally use the logged-in user's context on the backend
      const res = await axiosInstance.get('/accounts/my-account');
      setAccount(res.data);
    } catch (err) {
      console.error('Failed to fetch account details:', err);
      setErrorAccount(err.response?.data?.msg || 'Failed to fetch account details.');
    } finally {
      setLoadingAccount(false);
    }
  }, [user?.accountNumber]); // Added user dependency

  const fetchTransactions = useCallback(async (page = 1) => {
    if (!user?.accountNumber) return;

    setLoadingTransactions(true);
    setErrorTransactions('');
    try {
      const res = await axiosInstance.get(`/accounts/${user.accountNumber}/transactions?page=${page}&limit=5`);
      setTransactions(res.data.transactions);
      setTransactionPage(res.data.currentPage);
      setTransactionTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setErrorTransactions(err.response?.data?.msg || 'Failed to fetch transactions.');
    } finally {
      setLoadingTransactions(false);
    }
  }, [user?.accountNumber]); // Added user dependency

  useEffect(() => {
    if (user?.accountNumber) {
      fetchAccountDetails();
      fetchTransactions(transactionPage);
    }
  }, [user, fetchAccountDetails, fetchTransactions, transactionPage]); // user is a dependency now

  const handleTransactionSuccess = () => {
    // Re-fetch account details (for balance) and transactions
    fetchAccountDetails();
    fetchTransactions(1); // Reset to first page of transactions
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= transactionTotalPages) {
      setTransactionPage(newPage);
      // useEffect will re-fetch transactions
    }
  };

  if (!user) {
    return <p>Loading user information...</p>; // Should be handled by AuthContext loading typically
  }

  return (
    <div>
      <h2>Welcome to Your Dashboard, {user.firstName}!</h2>
      
      {loadingAccount && <p>Loading account summary...</p>}
      {errorAccount && <p style={{ color: 'red' }}>{errorAccount}</p>}
      {account && <AccountSummary account={account} />}

      <TransactionForm 
        accountNumber={user.accountNumber} 
        onTransactionSuccess={handleTransactionSuccess} 
      />

      <h3>Recent Transactions</h3>
      {loadingTransactions && <p>Loading transactions...</p>}
      {errorTransactions && <p style={{ color: 'red' }}>{errorTransactions}</p>}
      <TransactionList transactions={transactions} />
      <div>
        {transactions.length > 0 && Array.from({ length: transactionTotalPages }, (_, i) => i + 1).map(page => (
          <button 
            key={page} 
            onClick={() => handlePageChange(page)}
            disabled={page === transactionPage}
            style={{ margin: '0 5px' }}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
