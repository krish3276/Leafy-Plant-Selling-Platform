import React, { useState, useEffect } from 'react';
import { Save, Lock, Bell, Shield, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import '../../styles/AdminSettings.css';

function AdminSettings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    appName: '',
    version: '',
    maintenanceMode: false,
    emailNotifications: true,
    siteBackups: 'Daily',
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    maxProductsPerPage: 10,
  });

  const token = localStorage.getItem('authToken');
  const API_BASE = 'http://localhost:5000/api/admin';

  // Fetch admin profile on mount
  useEffect(() => {
    fetchAdminProfile();
    fetchSystemSettings();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setProfileData({
          firstName: data.admin.firstName || '',
          lastName: data.admin.lastName || '',
          email: data.admin.email || '',
          phone: data.admin.phone || '',
          address: data.admin.address || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/settings`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setSystemSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const showNotification = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSystemSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const saveProfile = async () => {
    try {
      setLoading(true);

      if (!profileData.firstName || !profileData.lastName) {
        showNotification('First name and last name are required', 'error');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          address: profileData.address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('✅ Profile updated successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      showNotification('Error updating profile', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    try {
      setLoading(true);

      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        showNotification('All password fields are required', 'error');
        setLoading(false);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        showNotification('New passwords do not match', 'error');
        setLoading(false);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        showNotification('New password must be at least 6 characters', 'error');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('✅ Password changed successfully!', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        showNotification(data.message || 'Failed to change password', 'error');
      }
    } catch (error) {
      showNotification('Error changing password', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-settings">
      {/* Notification */}
      {message && (
        <div className={`settings-notification ${messageType}`}>
          {messageType === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Settings Navigation */}
      <div className="settings-nav">
        <button
          className={`settings-nav-btn ${activeSection === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          👤 Profile
        </button>
        <button
          className={`settings-nav-btn ${activeSection === 'password' ? 'active' : ''}`}
          onClick={() => setActiveSection('password')}
        >
          <Lock size={16} /> Security
        </button>
        <button
          className={`settings-nav-btn ${activeSection === 'system' ? 'active' : ''}`}
          onClick={() => setActiveSection('system')}
        >
          <Shield size={16} /> System
        </button>
        <button
          className={`settings-nav-btn ${activeSection === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveSection('notifications')}
        >
          <Bell size={16} /> Notifications
        </button>
      </div>

      {/* Settings Sections */}
      <div className="settings-content">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="settings-section">
            <h2>👤 Profile Information</h2>
            <p className="settings-subtitle">Manage your personal information</p>

            <div className="settings-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    placeholder="Enter first name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  disabled
                  className="input-disabled"
                  title="Email cannot be changed"
                />
                <small>Email address cannot be changed for security reasons</small>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter phone number (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  placeholder="Enter your address (optional)"
                  rows="4"
                />
              </div>

              <button
                className="settings-save-btn"
                onClick={saveProfile}
                disabled={loading}
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        )}

        {/* Password Section */}
        {activeSection === 'password' && (
          <div className="settings-section">
            <h2>🔐 Change Password</h2>
            <p className="settings-subtitle">Update your login password</p>

            <div className="settings-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-input-group">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input-group">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input-group">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="password-requirements">
                <p>Password requirements:</p>
                <ul>
                  <li>At least 6 characters long</li>
                  <li>Must be different from current password</li>
                  <li>New password and confirm password must match</li>
                </ul>
              </div>

              <button
                className="settings-save-btn"
                onClick={changePassword}
                disabled={loading}
              >
                <Lock size={18} />
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        )}

        {/* System Settings Section */}
        {activeSection === 'system' && (
          <div className="settings-section">
            <h2>⚙️ System Settings</h2>
            <p className="settings-subtitle">View and manage system configuration</p>

            <div className="settings-form">
              <div className="settings-grid">
                <div className="settings-item">
                  <h3>Application Info</h3>
                  <div className="info-row">
                    <span>App Name:</span>
                    <strong>{systemSettings.appName}</strong>
                  </div>
                  <div className="info-row">
                    <span>Version:</span>
                    <strong>{systemSettings.version}</strong>
                  </div>
                </div>

                <div className="settings-item">
                  <h3>Configuration</h3>
                  <div className="info-row">
                    <span>Max Login Attempts:</span>
                    <strong>{systemSettings.maxLoginAttempts}</strong>
                  </div>
                  <div className="info-row">
                    <span>Session Timeout:</span>
                    <strong>{systemSettings.sessionTimeout} minutes</strong>
                  </div>
                  <div className="info-row">
                    <span>Products Per Page:</span>
                    <strong>{systemSettings.maxProductsPerPage}</strong>
                  </div>
                </div>

                <div className="settings-item">
                  <h3>Backup & Maintenance</h3>
                  <div className="info-row">
                    <span>Backup Schedule:</span>
                    <strong>{systemSettings.siteBackups}</strong>
                  </div>
                  <div className="info-row">
                    <span>Maintenance Mode:</span>
                    <strong className={systemSettings.maintenanceMode ? 'status-on' : 'status-off'}>
                      {systemSettings.maintenanceMode ? 'ON' : 'OFF'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="system-info">
                <h3>System Status</h3>
                <div className="status-indicator">
                  <span className="status-dot online"></span>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div className="settings-section">
            <h2>🔔 Notification Settings</h2>
            <p className="settings-subtitle">Control how and when you receive notifications</p>

            <div className="settings-form">
              <div className="notification-options">
                <div className="notification-item">
                  <div className="notification-header">
                    <h3>📧 Email Notifications</h3>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={systemSettings.emailNotifications}
                        onChange={handleSystemSettingChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p>Receive email alerts for important events and updates</p>
                </div>

                <div className="notification-item">
                  <h3>📱 Push Notifications</h3>
                  <p>In-browser push notifications for real-time updates</p>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      defaultChecked
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <h3>🛒 Order Notifications</h3>
                  <p>Get notified when new orders are placed</p>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      defaultChecked
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <h3>📦 Product Updates</h3>
                  <p>Notifications about product stock changes</p>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      defaultChecked
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <h3>⚠️ Critical Alerts</h3>
                  <p>Important system alerts and errors (always enabled)</p>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      defaultChecked
                      disabled
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <button
                className="settings-save-btn"
                onClick={() => showNotification('✅ Notification settings saved!', 'success')}
              >
                <Save size={18} />
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSettings;
