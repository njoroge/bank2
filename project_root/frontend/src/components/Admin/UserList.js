import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
// import CreateUserForm from './CreateUserForm'; // Assuming a separate form component
// import UpdateRolesForm from './UpdateRolesForm'; // Assuming a separate form component

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals/Forms states (simplified for this example)
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showUpdateRolesForm, setShowUpdateRolesForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get(`/admin/users?page=${currentPage}&limit=5`);
      setUsers(res.data.users);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.response?.data?.msg || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [fetchUsers, page]);

  const handleCreateUser = async (userData) => {
    // This function would be called by CreateUserForm
    setLoading(true);
    try {
      await axiosInstance.post('/admin/users', userData);
      fetchUsers(1); // Refresh user list to the first page
      setShowCreateUserForm(false);
    } catch (err) {
      console.error('Failed to create user:', err);
      setError(err.response?.data?.msg || 'Failed to create user.');
      // Keep form open or handle error display within the form
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoles = async (userId, rolesData) => {
    // This function would be called by UpdateRolesForm
    setLoading(true);
    try {
      await axiosInstance.put(`/admin/users/${userId}/roles`, { roles: rolesData });
      fetchUsers(page); // Refresh current page
      setShowUpdateRolesForm(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to update roles:', err);
      setError(err.response?.data?.msg || 'Failed to update roles.');
    } finally {
      setLoading(false);
    }
  };
  
  const openUpdateRolesModal = (user) => {
    setSelectedUser(user);
    setShowUpdateRolesForm(true);
  };

  if (loading && users.length === 0) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h4>User List</h4>
      <button onClick={() => setShowCreateUserForm(true)} style={{ marginBottom: '10px' }}>Create New User</button>
      
      {/* Basic Modal/Form Placeholders - In a real app, use a modal library or better form components */}
      {showCreateUserForm && (
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px 0' }}>
          <h5>Create User Form Placeholder</h5>
          <p>Form fields for firstName, lastName, accountNumber, pin, roles...</p>
          <button onClick={() => handleCreateUser({firstName: 'Test', lastName: 'User', accountNumber: 'T123', pin: '123456'})}>Simulate Create</button>
          <button onClick={() => setShowCreateUserForm(false)}>Close</button>
        </div>
      )}
      {showUpdateRolesForm && selectedUser && (
         <div style={{ border: '1px solid black', padding: '10px', margin: '10px 0' }}>
          <h5>Update Roles for {selectedUser.firstName} (ID: {selectedUser._id})</h5>
          <p>Form fields for roles (isAdmin, isTeller, etc.). Current: {JSON.stringify(selectedUser.roles)}</p>
          {/* Example: A simple checkbox for isAdmin */}
          <label>
            isAdmin: 
            <input 
                type="checkbox" 
                defaultChecked={selectedUser.roles.isAdmin} 
                onChange={(e) => {
                    // For a real form, manage this state properly
                    const updatedRoles = { ...selectedUser.roles, isAdmin: e.target.checked };
                    setSelectedUser({...selectedUser, roles: updatedRoles }); // Update local state for submission
                }}
            />
          </label>
          <button onClick={() => handleUpdateRoles(selectedUser._id, selectedUser.roles)}>Simulate Update Roles</button>
          <button onClick={() => { setShowUpdateRolesForm(false); setSelectedUser(null); }}>Close</button>
        </div>
      )}


      {users.length === 0 && !loading ? (
        <p>No users to display.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Account Number</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Roles</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user._id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.firstName} {user.lastName}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.accountNumber}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {Object.keys(user.roles)
                      .filter((role) => user.roles[role])
                      .join(', ')}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button onClick={() => openUpdateRolesModal(user)}>Edit Roles</button>
                  </td>
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

export default UserList;
