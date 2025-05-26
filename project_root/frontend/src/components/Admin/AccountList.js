import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAccounts = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get(`/admin/accounts?page=${currentPage}&limit=5`);
      setAccounts(res.data.accounts);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
      setError(err.response?.data?.msg || 'Failed to fetch accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts(page);
  }, [fetchAccounts, page]);

  if (loading && accounts.length === 0) return <p>Loading accounts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h4>Account List (Admin View)</h4>
      {accounts.length === 0 && !loading ? (
        <p>No accounts to display.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Account ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Account Number</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>User</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Balance</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account._id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{account._id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{account.accountNumber}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {account.userId ? `${account.userId.firstName} ${account.userId.lastName} (Acc: ${account.userId.accountNumber})` : 'N/A'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${account.balance.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(account.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button 
                key={p} 
                onClick={() => setPage(p)}
                disabled={p === page || loading}
                style={{ margin: '5px' }}
              >
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AccountList;
