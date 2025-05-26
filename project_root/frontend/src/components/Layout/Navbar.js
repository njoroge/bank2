import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
          <h1>Banking Application</h1>
        </Link>
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: '15px' }}>
              Welcome, {user?.firstName || 'User'}! 
              (Role: {user?.roles && Object.keys(user.roles).filter(role => user.roles[role]).join(', ')})
            </span>
            {user?.roles?.isAdmin && (
              <Link to="/admin" style={{ marginRight: '10px' }}>Admin</Link>
            )}
            <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
