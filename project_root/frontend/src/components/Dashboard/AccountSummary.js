import React from 'react';

const AccountSummary = ({ account }) => {
  if (!account) {
    return <p>Loading account details...</p>;
  }

  return (
    <div style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem' }}>
      <h4>Account Summary</h4>
      <p><strong>Account Number:</strong> {account.accountNumber}</p>
      <p><strong>Balance:</strong> ${typeof account.balance === 'number' ? account.balance.toFixed(2) : 'N/A'}</p>
    </div>
  );
};

export default AccountSummary;
