import React, { useState, useEffect } from 'react';
import { Save, Lock, Bell, Shield, Eye, EyeOff, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import '../../styles/AdminSettings.css';

const API_BASE = `${import.meta.env.VITE_API_URL}/api/admin`;

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

  // Notification preferences state
  const [notificationPreferences, setNotificationPreferences] = useState({
    preferences: {
      orderPlaced: { enabled: true, email: true, push: true, inApp: true },
      orderUpdated: { enabled: true, email: true, push: true, inApp: true },
      orderCancelled: { enabled: true, email: true, push: false, inApp: true },
      orderDelivered: { enabled: true, email: true, push: true, inApp: true },
      systemAlert: { enabled: true, email: true, push: true, inApp: true },
      productUpdates: { enabled: true, email: false, push: true, inApp: true },
    },
    globalSettings: {
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
      frequency: 'immediate',
      doNotDisturb: false,
      soundEnabled: true,
      desktopNotifications: true,
    },
  });

  const token = localStorage.getItem('authToken');
  // Fetch admin profile on mount
  useEffect(() => {
    fetchAdminProfile();
    fetchSystemSettings();
    fetchNotificationPreferences();
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

  // 🔔 Fetch notification preferences from backend
  const fetchNotificationPreferences = async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications/preferences`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success && data.preferences) {
        setNotificationPreferences({
          preferences: data.preferences.preferences,
          globalSettings: data.preferences.globalSettings,
        });
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };

  // 🔔 Update individual notification type
  const updateNotificationType = async (notificationType, updates) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/notifications/preferences/type`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationType,
          ...updates,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setNotificationPreferences((prev) => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [notificationType]: {
              ...prev.preferences[notificationType],
              ...updates,
            },
          },
        }));
        showNotification(`✅ ${notificationType} preferences updated!`, 'success');
      } else {
        showNotification(data.message || 'Failed to update notification preferences', 'error');
      }
    } catch (error) {
      showNotification('Error updating notification preferences', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔔 Update global notification settings
  const updateGlobalNotificationSettings = async () => {
    try {
      setLoading(true);

      // Validate quiet hours
      if (notificationPreferences.globalSettings.quietHoursEnabled) {
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(notificationPreferences.globalSettings.quietHoursStart)) {
          showNotification('Invalid quiet hours start time. Use HH:mm format', 'error');
          setLoading(false);
          return;
        }
        if (!timeRegex.test(notificationPreferences.globalSettings.quietHoursEnd)) {
          showNotification('Invalid quiet hours end time. Use HH:mm format', 'error');
          setLoading(false);
          return;
        }
      }

      const response = await fetch(`${API_BASE}/notifications/preferences/global`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationPreferences.globalSettings),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('✅ Global notification settings updated!', 'success');
      } else {
        showNotification(data.message || 'Failed to update settings', 'error');
      }
    } catch (error) {
      showNotification('Error updating global settings', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔔 Reset notification preferences to defaults
  const resetNotificationPreferences = async () => {
    if (window.confirm('Are you sure you want to reset all notification preferences to defaults?')) {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE}/notifications/preferences/reset`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const data = await response.json();

        if (data.success) {
          setNotificationPreferences({
            preferences: data.preferences.preferences,
            globalSettings: data.preferences.globalSettings,
          });
          showNotification('✅ Preferences reset to defaults!', 'success');
        } else {
          showNotification('Failed to reset preferences', 'error');
        }
      } catch (error) {
        showNotification('Error resetting preferences', 'error');
        console.error(error);
      } finally {
        setLoading(false);
      }
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
              {/* Notification Type Preferences */}
              <div className="notification-preferences-container">
                <h3 className="section-title">📋 Notification Type Preferences</h3>
                
                {Object.entries(notificationPreferences.preferences).map(([type, settings]) => (
                  <div key={type} className="notification-type-card">
                    <div className="notification-type-header">
                      <div className="type-info">
                        <h4>{type.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={settings.enabled}
                            onChange={() =>
                              updateNotificationType(type, {
                                enabled: !settings.enabled,
                              })
                            }
                            disabled={loading}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    {settings.enabled && (
                      <div className="channel-toggles">
                        <label className="channel-toggle">
                          <input
                            type="checkbox"
                            checked={settings.email}
                            onChange={() =>
                              updateNotificationType(type, {
                                email: !settings.email,
                              })
                            }
                            disabled={loading}
                          />
                          <span>📧 Email</span>
                        </label>

                        <label className="channel-toggle">
                          <input
                            type="checkbox"
                            checked={settings.push}
                            onChange={() =>
                              updateNotificationType(type, {
                                push: !settings.push,
                              })
                            }
                            disabled={loading}
                          />
                          <span>🔔 Push</span>
                        </label>

                        <label className="channel-toggle">
                          <input
                            type="checkbox"
                            checked={settings.inApp}
                            onChange={() =>
                              updateNotificationType(type, {
                                inApp: !settings.inApp,
                              })
                            }
                            disabled={loading}
                          />
                          <span>💬 In-App</span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Global Notification Settings */}
              <div className="global-settings-container">
                <h3 className="section-title">⚙️ Global Settings</h3>

                {/* Notification Frequency */}
                <div className="settings-group">
                  <label>📡 Notification Frequency</label>
                  <select
                    value={notificationPreferences.globalSettings.frequency}
                    onChange={(e) =>
                      setNotificationPreferences((prev) => ({
                        ...prev,
                        globalSettings: {
                          ...prev.globalSettings,
                          frequency: e.target.value,
                        },
                      }))
                    }
                    disabled={loading}
                  >
                    <option value="immediate">Immediate</option>
                    <option value="daily_digest">Daily Digest</option>
                    <option value="weekly_digest">Weekly Digest</option>
                  </select>
                </div>

                {/* Quiet Hours */}
                <div className="settings-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={notificationPreferences.globalSettings.quietHoursEnabled}
                      onChange={(e) =>
                        setNotificationPreferences((prev) => ({
                          ...prev,
                          globalSettings: {
                            ...prev.globalSettings,
                            quietHoursEnabled: e.target.checked,
                          },
                        }))
                      }
                      disabled={loading}
                    />
                    <span>🕐 Enable Quiet Hours</span>
                  </label>

                  {notificationPreferences.globalSettings.quietHoursEnabled && (
                    <div className="time-inputs">
                      <div className="time-input-group">
                        <label>From:</label>
                        <input
                          type="time"
                          value={notificationPreferences.globalSettings.quietHoursStart}
                          onChange={(e) =>
                            setNotificationPreferences((prev) => ({
                              ...prev,
                              globalSettings: {
                                ...prev.globalSettings,
                                quietHoursStart: e.target.value,
                              },
                            }))
                          }
                          disabled={loading}
                        />
                      </div>
                      <div className="time-input-group">
                        <label>To:</label>
                        <input
                          type="time"
                          value={notificationPreferences.globalSettings.quietHoursEnd}
                          onChange={(e) =>
                            setNotificationPreferences((prev) => ({
                              ...prev,
                              globalSettings: {
                                ...prev.globalSettings,
                                quietHoursEnd: e.target.value,
                              },
                            }))
                          }
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sound Toggle */}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={notificationPreferences.globalSettings.soundEnabled}
                    onChange={(e) =>
                      setNotificationPreferences((prev) => ({
                        ...prev,
                        globalSettings: {
                          ...prev.globalSettings,
                          soundEnabled: e.target.checked,
                        },
                      }))
                    }
                    disabled={loading}
                  />
                  <span>🔊 Enable Sound Notifications</span>
                </label>

                {/* Desktop Notifications Toggle */}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={notificationPreferences.globalSettings.desktopNotifications}
                    onChange={(e) =>
                      setNotificationPreferences((prev) => ({
                        ...prev,
                        globalSettings: {
                          ...prev.globalSettings,
                          desktopNotifications: e.target.checked,
                        },
                      }))
                    }
                    disabled={loading}
                  />
                  <span>🖥️ Enable Desktop Notifications</span>
                </label>

                {/* Do Not Disturb Toggle */}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={notificationPreferences.globalSettings.doNotDisturb}
                    onChange={(e) =>
                      setNotificationPreferences((prev) => ({
                        ...prev,
                        globalSettings: {
                          ...prev.globalSettings,
                          doNotDisturb: e.target.checked,
                        },
                      }))
                    }
                    disabled={loading}
                  />
                  <span>⛔ Do Not Disturb (Silence All)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="settings-actions">
                <button
                  className="settings-save-btn"
                  onClick={updateGlobalNotificationSettings}
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Global Settings'}
                </button>

                <button
                  className="settings-reset-btn"
                  onClick={resetNotificationPreferences}
                  disabled={loading}
                >
                  <RotateCcw size={18} />
                  {loading ? 'Resetting...' : 'Reset to Defaults'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSettings;
