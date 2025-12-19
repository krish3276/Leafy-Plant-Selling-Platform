import React, { useState, useEffect } from 'react';
import { Search, Shield, Trash2, AlertCircle } from 'lucide-react';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `http://localhost:5000/api/admin/users?page=${page}&limit=10&search=${searchTerm}&role=${roleFilter}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to fetch users');
        return;
      }

      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to update role');
        return;
      }

      setSuccess(`User role updated to ${newRole}`);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to update user role');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/deactivate`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to deactivate user');
        return;
      }

      setSuccess('User deactivated successfully');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to deactivate user');
    }
  };

  return (
    <div className="user-management">
      {/* Header */}
      <div className="user-mgmt-header">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="search-btn">Search</button>
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✓ {success}</span>
        </div>
      )}

      {/* Table */}
      <div className="user-table-container">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">{user.firstName?.[0]}</div>
                            <span>{user.firstName} {user.lastName}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'admin' ? '👨‍💼' : '👤'} {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="action-buttons">
                          <button
                            className="role-btn"
                            onClick={() => handleToggleRole(user._id, user.role)}
                            title="Toggle role"
                          >
                            <Shield size={18} />
                            {user.role === 'customer' ? 'Make Admin' : 'Make Customer'}
                          </button>
                          {user.isActive && (
                            <button
                              className="deactivate-btn"
                              onClick={() => handleDeactivateUser(user._id)}
                              title="Deactivate"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-message">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
