import React, { useState } from 'react';
import UserList from './UserList';
import AccountList from './AccountList';
// Placeholder for a component to view all transactions if desired
// import AdminTransactionList from './AdminTransactionList'; 

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('users'); // 'users', 'accounts', 'transactions'

  const renderActiveView = () => {
    switch (activeView) {
      case 'users':
        return <UserList />;
      case 'accounts':
        return <AccountList />;
      // case 'transactions':
      //   return <AdminTransactionList />; // Component to be created if needed
      default:
        return <p>Please select a view.</p>;
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin! Manage users, accounts, and view system-wide transactions.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveView('users')} disabled={activeView === 'users'} style={{marginRight: '10px'}}>
          Manage Users
        </button>
        <button onClick={() => setActiveView('accounts')} disabled={activeView === 'accounts'} style={{marginRight: '10px'}}>
          View All Accounts
        </button>
        {/* <button onClick={() => setActiveView('transactions')} disabled={activeView === 'transactions'}>
          View All Transactions
        </button> */}
      </div>

      <div>
        {renderActiveView()}
      </div>
    </div>
  );
};

export default AdminDashboard;
