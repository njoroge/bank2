import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProtectedRoute from './components/Routing/ProtectedRoute';
import { useAuth } from './context/useAuth';

function App() {
  const { isAuthenticated, loading } = useAuth(); // Get loading state as well

  if (loading) {
    return <div>Loading application...</div>; // Or a proper spinner component
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ padding: '20px', minHeight: '80vh' }}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginForm /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterForm /> : <Navigate to="/dashboard" />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['isAdmin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              } 
            />
            {/* Example of a catch-all or 404 route */}
            <Route path="*" element={<div><h2>404 - Page Not Found</h2><p>The page you are looking for does not exist.</p></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// It's better to wrap App with AuthProvider in index.js,
// but if App is the top-level component that needs routing,
// it should be inside Router.
// For this task, index.js already wraps App with AuthProvider,
// so App itself doesn't need to be wrapped again.
// The Router should be here or in index.js wrapping App.
// Current setup in index.js has AuthProvider > App, and App has Router. This is fine.

export default App;
