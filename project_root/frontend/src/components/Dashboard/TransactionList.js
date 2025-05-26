import React from 'react';

const TransactionList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <p>No transactions to display.</p>;
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <h4>Transaction History</h4>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {transactions.map((tx) => (
          <li key={tx.id} style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
            <p><strong>Description:</strong> {tx.description}</p>
            <p><strong>Amount:</strong> <span style={{ color: tx.amount < 0 ? 'red' : 'green' }}>${tx.amount.toFixed(2)}</span></p>
            <p><strong>Date:</strong> {tx.date}</p>
            <p><strong>Type:</strong> {tx.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
