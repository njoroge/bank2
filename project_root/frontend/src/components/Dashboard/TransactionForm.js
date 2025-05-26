import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/useAuth'; // To potentially get user's primary accountNumber if needed

const TransactionForm = ({ accountNumber, onTransactionSuccess }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('deposit'); // 'deposit' or 'withdrawal'
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!accountNumber) {
        setError("Account number is missing.");
        setLoading(false);
        return;
    }
    if (parseFloat(amount) <= 0) {
        setError("Amount must be positive.");
        setLoading(false);
        return;
    }


    const endpoint = `/accounts/${type}`;
    const payload = {
      accountNumber, // The account to affect
      amount: parseFloat(amount),
      description: description || `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`,
    };

    try {
      const res = await axiosInstance.post(endpoint, payload);
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} successful! New balance: $${res.data.accountBalance}`);
      setAmount('');
      setDescription('');
      if (onTransactionSuccess) {
        onTransactionSuccess();
      }
    } catch (err) {
      console.error(`Failed to perform ${type}:`, err);
      setError(err.response?.data?.msg || `Failed to perform ${type}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <h4>Make a Transaction</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="type">Transaction Type: </label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="amount">Amount: </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
            min="0.01"
            step="0.01"
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="description">Description (Optional): </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Transaction description"
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>
          {loading ? `Processing ${type}...` : `Perform ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
