import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import '../styles/Auth.css';
import '../styles/AdminLogin.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Check if user is admin
      if (data.user.role !== 'admin') {
        setError('Unauthorized: Admin access required');
        setLoading(false);
        return;
      }

      // Save token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess('Admin login successful! Redirecting...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Login Error:', err);
      setError('Server error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        {/* Admin Header */}
        <div className="admin-header">
          <div className="admin-logo-icon">🔐</div>
          <h1 className="admin-title">Admin Portal</h1>
          <p className="admin-subtitle">Secure Access Only</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message-admin">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="success-message-admin">
            <span>✓ {success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Admin Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@leafy.com"
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Sign In to Admin Portal
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="admin-footer">
          <p className="admin-footer-text">
            Not an admin? <Link to="/login" className="admin-footer-link">Back to Login</Link>
          </p>
          <p className="admin-footer-warning">
            ⚠️ Unauthorized access attempts are logged
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="admin-bg-decoration"></div>
    </div>
  );
}

export default AdminLogin;
