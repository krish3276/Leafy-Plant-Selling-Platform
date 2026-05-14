/**
 * 🔔 Notification Service
 * Handles all API calls related to admin notification preferences
 * 
 * Usage:
 * import { getNotificationPreferences, updateNotificationType } from './notificationService';
 * 
 * const prefs = await getNotificationPreferences(token);
 */

const API_BASE = 'http://localhost:5000/api/admin/notifications';

/**
 * Get all notification preferences for the current admin
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Preferences data
 */
export const getNotificationPreferences = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/preferences`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch preferences');
    }

    return data.preferences;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
};

/**
 * Get notification preferences summary
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Summary data with statistics
 */
export const getNotificationPreferencesSummary = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/preferences/summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch summary');
    }

    return data.summary;
  } catch (error) {
    console.error('Error fetching notification summary:', error);
    throw error;
  }
};

/**
 * Update a specific notification type preference
 * @param {string} token - Authentication token
 * @param {string} notificationType - Type of notification to update
 * @param {Object} updates - Updates to apply (enabled, email, push, inApp)
 * @returns {Promise<Object>} Updated preferences
 */
export const updateNotificationType = async (token, notificationType, updates) => {
  try {
    const response = await fetch(`${API_BASE}/preferences/type`, {
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

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update notification type');
    }

    return data.preferences;
  } catch (error) {
    console.error(`Error updating ${notificationType} preferences:`, error);
    throw error;
  }
};

/**
 * Update all notification preferences at once
 * @param {string} token - Authentication token
 * @param {Object} preferences - All preferences object with all notification types
 * @returns {Promise<Object>} Updated preferences
 */
export const updateAllNotificationPreferences = async (token, preferences) => {
  try {
    const response = await fetch(`${API_BASE}/preferences/all`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preferences }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update preferences');
    }

    return data.preferences;
  } catch (error) {
    console.error('Error updating all preferences:', error);
    throw error;
  }
};

/**
 * Update global notification settings
 * @param {string} token - Authentication token
 * @param {Object} globalSettings - Global settings object
 * @returns {Promise<Object>} Updated preferences
 */
export const updateGlobalNotificationSettings = async (token, globalSettings) => {
  try {
    const response = await fetch(`${API_BASE}/preferences/global`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(globalSettings),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update global settings');
    }

    return data.preferences;
  } catch (error) {
    console.error('Error updating global settings:', error);
    throw error;
  }
};

/**
 * Reset notification preferences to defaults
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Reset preferences with default values
 */
export const resetNotificationPreferences = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/preferences/reset`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset preferences');
    }

    return data.preferences;
  } catch (error) {
    console.error('Error resetting preferences:', error);
    throw error;
  }
};

/**
 * Validate time format (HH:mm)
 * @param {string} time - Time string to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateTimeFormat = (time) => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Format notification type name for display
 * @param {string} type - Notification type
 * @returns {string} Formatted type name
 */
export const formatNotificationType = (type) => {
  return type
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .charAt(0)
    .toUpperCase() + type.slice(1);
};

/**
 * Get notification type icon
 * @param {string} type - Notification type
 * @returns {string} Icon emoji
 */
export const getNotificationTypeIcon = (type) => {
  const icons = {
    orderPlaced: '🛒',
    orderUpdated: '📦',
    orderCancelled: '❌',
    orderDelivered: '✅',
    systemAlert: '⚠️',
    productUpdates: '🏪',
  };
  return icons[type] || '🔔';
};

/**
 * Default notification preferences
 */
export const DEFAULT_NOTIFICATION_PREFERENCES = {
  preferences: {
    orderPlaced: {
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    orderUpdated: {
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    orderCancelled: {
      enabled: true,
      email: true,
      push: false,
      inApp: true,
    },
    orderDelivered: {
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    systemAlert: {
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    productUpdates: {
      enabled: true,
      email: false,
      push: true,
      inApp: true,
    },
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
};
