# 🔔 Developer Quick Reference - Notification Integration

## 📋 Table of Contents
- [Import the Service](#import-the-service)
- [Common Use Cases](#common-use-cases)
- [Code Examples](#code-examples)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)

---

## Import the Service

```javascript
// In any React component
import {
  getNotificationPreferences,
  getNotificationPreferencesSummary,
  updateNotificationType,
  updateAllNotificationPreferences,
  updateGlobalNotificationSettings,
  resetNotificationPreferences,
  validateTimeFormat,
  formatNotificationType,
  getNotificationTypeIcon,
  DEFAULT_NOTIFICATION_PREFERENCES
} from '../utils/notificationService';
```

---

## Common Use Cases

### 1️⃣ Fetch Current Preferences

```javascript
const fetchPrefs = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const preferences = await getNotificationPreferences(token);
    console.log('Current preferences:', preferences);
    setPreferences(preferences);
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
};

// Call in useEffect
useEffect(() => {
  fetchPrefs();
}, []);
```

### 2️⃣ Toggle Single Notification Type

```javascript
const toggleOrderPlaced = async (enabled) => {
  try {
    const token = localStorage.getItem('authToken');
    const updated = await updateNotificationType(token, 'orderPlaced', {
      enabled: enabled
    });
    console.log('Updated:', updated);
    // Update local state
  } catch (error) {
    showError('Failed to update preference');
  }
};

// Usage
<button onClick={() => toggleOrderPlaced(false)}>
  Disable Order Notifications
</button>
```

### 3️⃣ Update Delivery Channel for Type

```javascript
const disableEmailForOrders = async () => {
  try {
    const token = localStorage.getItem('authToken');
    await updateNotificationType(token, 'orderPlaced', {
      email: false  // Only update email, others stay unchanged
    });
    showSuccess('Email notifications disabled for orders');
  } catch (error) {
    showError('Failed to update');
  }
};
```

### 4️⃣ Update Global Settings

```javascript
const enableQuietHours = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const updated = await updateGlobalNotificationSettings(token, {
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00'
    });
    showSuccess('Quiet hours enabled');
  } catch (error) {
    showError('Failed to update global settings');
  }
};
```

### 5️⃣ Get Summary Statistics

```javascript
const showStats = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const summary = await getNotificationPreferencesSummary(token);
    
    console.log('Enabled notifications:', summary.enabledNotifications);
    console.log('Email channels:', summary.emailEnabled);
    console.log('Push channels:', summary.pushEnabled);
    console.log('In-app channels:', summary.inAppEnabled);
  } catch (error) {
    console.error('Failed to get summary:', error);
  }
};
```

### 6️⃣ Reset to Defaults

```javascript
const resetToDefaults = async () => {
  if (window.confirm('Reset all preferences to defaults?')) {
    try {
      const token = localStorage.getItem('authToken');
      const reset = await resetNotificationPreferences(token);
      setPreferences(reset);
      showSuccess('Reset to defaults');
    } catch (error) {
      showError('Failed to reset');
    }
  }
};
```

---

## Code Examples

### Complete Component Example

```javascript
import React, { useState, useEffect } from 'react';
import {
  getNotificationPreferences,
  updateNotificationType,
  getNotificationTypeIcon,
  formatNotificationType
} from '../utils/notificationService';

function NotificationCenter() {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await getNotificationPreferences(token);
      setPreferences(prefs);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (type, field) => {
    try {
      const current = preferences.preferences[type][field];
      await updateNotificationType(token, type, {
        [field]: !current
      });
      
      // Update local state
      setPreferences(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [type]: {
            ...prev.preferences[type],
            [field]: !current
          }
        }
      }));
    } catch (error) {
      alert('Failed to update');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!preferences) return <div>Error loading preferences</div>;

  return (
    <div>
      {Object.entries(preferences.preferences).map(([type, settings]) => (
        <div key={type}>
          <h3>{getNotificationTypeIcon(type)} {formatNotificationType(type)}</h3>
          <label>
            <input
              type="checkbox"
              checked={settings.email}
              onChange={() => handleToggle(type, 'email')}
            />
            Email
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.push}
              onChange={() => handleToggle(type, 'push')}
            />
            Push
          </label>
        </div>
      ))}
    </div>
  );
}

export default NotificationCenter;
```

### Form Validation Example

```javascript
const validateQuietHours = (start, end) => {
  const { validateTimeFormat } = require('../utils/notificationService');
  
  if (!validateTimeFormat(start)) {
    throw new Error('Invalid start time format');
  }
  if (!validateTimeFormat(end)) {
    throw new Error('Invalid end time format');
  }
  
  // Convert to minutes for comparison
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  const startMins = startHour * 60 + startMin;
  const endMins = endHour * 60 + endMin;
  
  if (startMins >= endMins) {
    throw new Error('Start time must be before end time');
  }
  
  return true;
};

// Usage
try {
  validateQuietHours('22:00', '08:00');
  console.log('Valid');
} catch (error) {
  console.error(error.message);
}
```

---

## Error Handling

### Standard Error Pattern

```javascript
const updatePreference = async (type, updates) => {
  try {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const result = await updateNotificationType(token, type, updates);
    showSuccess('Preference updated');
    return result;
    
  } catch (error) {
    // Handle different error types
    if (error.message.includes('Invalid notification type')) {
      showError('Invalid notification type');
    } else if (error.message.includes('Failed to update')) {
      showError('Update failed. Please try again.');
    } else {
      showError(error.message);
    }
  } finally {
    setLoading(false);
  }
};
```

### Retry Logic

```javascript
const updateWithRetry = async (type, updates, maxRetries = 3) => {
  const token = localStorage.getItem('authToken');
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await updateNotificationType(token, type, updates);
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw lastError;
};
```

---

## API Endpoints Reference

### GET - Fetch Preferences
```
GET /api/admin/notifications/preferences
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "preferences": { ... }
}
```

### PUT - Update Notification Type
```
PUT /api/admin/notifications/preferences/type
Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "notificationType": "orderPlaced",
  "enabled": true,
  "email": false,
  "push": true,
  "inApp": true
}
```

### PUT - Update Global Settings
```
PUT /api/admin/notifications/preferences/global
Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "quietHoursEnabled": true,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "08:00",
  "frequency": "immediate",
  "doNotDisturb": false,
  "soundEnabled": true,
  "desktopNotifications": true
}
```

### POST - Reset to Defaults
```
POST /api/admin/notifications/preferences/reset
Headers:
  Authorization: Bearer {token}
```

---

## Helper Functions

### Format Notification Type
```javascript
import { formatNotificationType } from '../utils/notificationService';

console.log(formatNotificationType('orderPlaced')); 
// Output: "Order Placed"
```

### Get Notification Icon
```javascript
import { getNotificationTypeIcon } from '../utils/notificationService';

console.log(getNotificationTypeIcon('orderPlaced')); 
// Output: "🛒"
```

### Validate Time Format
```javascript
import { validateTimeFormat } from '../utils/notificationService';

console.log(validateTimeFormat('22:00')); // true
console.log(validateTimeFormat('25:00')); // false
console.log(validateTimeFormat('22')); // false
```

---

## Default Values

```javascript
import { DEFAULT_NOTIFICATION_PREFERENCES } from '../utils/notificationService';

console.log(DEFAULT_NOTIFICATION_PREFERENCES);
// Shows all default values
```

---

## Tips & Best Practices

✅ **Always** get token from localStorage before making requests
✅ **Always** use try-catch blocks for async operations
✅ **Always** validate time format before updating quiet hours
✅ **Always** show loading state during API calls
✅ **Always** update local state after successful API call
✅ **Don't** hardcode API URLs - use service functions
✅ **Don't** call API multiple times without debouncing
✅ **Don't** forget to handle 401 errors (invalid token)

---

## Debugging

### Check Network Requests
```javascript
// In browser DevTools
// Go to Network tab and look for requests to:
// GET /api/admin/notifications/preferences
// PUT /api/admin/notifications/preferences/type
// etc.
```

### Console Logging
```javascript
const prefs = await getNotificationPreferences(token);
console.log('Preferences loaded:', prefs);
console.log('Order Placed settings:', prefs.preferences.orderPlaced);
console.log('Global settings:', prefs.globalSettings);
```

### Check Token
```javascript
const token = localStorage.getItem('authToken');
console.log('Token exists:', !!token);
console.log('Token:', token);
```

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Failed to fetch` | Invalid token or network issue | Check token validity, ensure backend is running |
| `Invalid notification type` | Wrong notification type name | Use correct type: orderPlaced, orderUpdated, etc |
| `Invalid time format` | Time not in HH:mm format | Use 24-hour format: 22:00, 08:00 |
| `CORS error` | Backend CORS not configured | Check server.js CORS settings |
| `401 Unauthorized` | Token expired or invalid | Refresh login and get new token |

---

## Next Steps

1. Import the service in your component
2. Call functions as needed
3. Handle errors appropriately
4. Update UI based on preferences
5. Test in browser DevTools

Happy coding! 🚀
