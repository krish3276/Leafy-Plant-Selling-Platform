# ⚙️ Admin Settings Feature Documentation

## Overview

The Admin Settings page provides comprehensive account and system management for administrators. It's accessible through the admin dashboard under the "Settings" tab.

## Features

### 1. **Profile Management** 👤
- **Update Personal Information**
  - First Name
  - Last Name
  - Phone Number
  - Address
  - Email (read-only for security)

- **Features:**
  - Real-time form validation
  - Email address cannot be changed (security measure)
  - Save changes with instant feedback
  - Error handling for invalid inputs

### 2. **Security Settings** 🔐
- **Change Password**
  - Current password verification
  - New password with strength requirements
  - Password confirmation matching
  - Show/hide password toggle

- **Security Features:**
  - Minimum 6 characters required
  - Current password must match
  - New passwords must match each other
  - Clear password requirements display
  - All passwords validated server-side

### 3. **System Settings** ⚙️
View and manage system configuration:
- **Application Info**
  - App Name
  - Version
  
- **Configuration**
  - Max Login Attempts
  - Session Timeout
  - Products Per Page
  
- **Backup & Maintenance**
  - Backup Schedule
  - Maintenance Mode Status

- **System Status**
  - Real-time system health indicator
  - Operational status display

### 4. **Notification Settings** 🔔
Control notification preferences:
- 📧 **Email Notifications** - For important events
- 📱 **Push Notifications** - Real-time browser alerts
- 🛒 **Order Notifications** - New order alerts
- 📦 **Product Updates** - Stock change alerts
- ⚠️ **Critical Alerts** - System alerts (always enabled)

## API Endpoints

All endpoints require admin authentication (Bearer token in Authorization header).

### Profile Endpoints

**Get Admin Profile**
```
GET /api/admin/profile
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "admin": {
    "_id": "user_id",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@leafy.com",
    "phone": "+91-9000000000",
    "address": "Leafy Headquarters",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-12-19T...",
    "updatedAt": "2025-12-19T..."
  }
}
```

**Update Admin Profile**
```
PUT /api/admin/profile
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91-9123456789",
  "address": "New Address, City"
}
```

Response:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "admin": { /* updated admin data */ }
}
```

### Security Endpoints

**Change Password**
```
PUT /api/admin/change-password
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "currentPassword": "Admin@123456",
  "newPassword": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

Response:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### System Settings Endpoint

**Get System Settings**
```
GET /api/admin/settings
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "settings": {
    "appName": "Leafy Plants",
    "version": "1.0.0",
    "maintenanceMode": false,
    "emailNotifications": true,
    "siteBackups": "Daily",
    "maxLoginAttempts": 5,
    "sessionTimeout": 30,
    "maxProductsPerPage": 10
  }
}
```

## File Structure

```
Frontend/leafy-frontend/src/
├── components/Admin/
│   └── AdminSettings.jsx          # Settings component (580+ lines)
├── styles/
│   └── AdminSettings.css          # Settings styles (~600 lines)
└── pages/
    └── AdminDashboard.jsx         # Updated to include settings

Backend/
├── controllers/
│   └── adminController.js         # Added settings endpoints
└── routes/
    └── adminRoutes.js             # Added settings routes
```

## Component Details

### AdminSettings Component

**State Variables:**
- `activeSection` - Current active settings tab (profile, password, system, notifications)
- `profileData` - User profile information
- `passwordData` - Password change form data
- `systemSettings` - System configuration settings
- `loading` - Loading state for API calls
- `message` - Notification message
- `messageType` - Message type (success/error)

**Key Functions:**
- `fetchAdminProfile()` - Load admin profile data
- `fetchSystemSettings()` - Load system configuration
- `saveProfile()` - Update profile information
- `changePassword()` - Change admin password
- `showNotification()` - Display success/error messages
- `handleProfileChange()` - Handle form input changes

**Props:** None (uses localStorage for auth token)

## Styling

The AdminSettings.css file provides:
- Modern, professional UI design
- Responsive layout (desktop, tablet, mobile)
- Color scheme matching the Leafy brand (#2d5f3f primary)
- Smooth animations and transitions
- Form validation visual feedback
- Status indicators and icons
- Toggle switches for preferences
- Grid layouts for multi-column displays

### CSS Classes

- `.admin-settings` - Main container
- `.settings-nav` - Navigation tabs
- `.settings-content` - Content area
- `.settings-section` - Individual sections
- `.settings-form` - Form containers
- `.form-group` - Individual form fields
- `.settings-save-btn` - Save buttons
- `.toggle-switch` - Toggle switches
- `.notification-item` - Notification options

## Security Considerations

1. **Password Protection**
   - Current password must be verified before change
   - New password validated on both client and server
   - Passwords hashed with bcryptjs (10 salt rounds)

2. **Email Protection**
   - Email address cannot be changed (read-only)
   - Prevents email hijacking

3. **Authentication**
   - All endpoints require valid JWT token
   - Admin role verification on server side
   - Token included in Authorization header

4. **Data Validation**
   - Client-side validation for user feedback
   - Server-side validation for security
   - Input trimming and sanitization

## User Experience

### Notifications
- Success messages with checkmark icon
- Error messages with alert icon
- Auto-dismiss after 3 seconds
- Persistent during async operations

### Form Behavior
- Real-time validation feedback
- Clear error messages
- Disabled submit while loading
- Success confirmation on save

### Responsive Design
- Mobile-optimized layout
- Stacked form fields on small screens
- Touch-friendly button sizes
- Horizontal scroll for navigation on mobile

## Backend Implementation

### New Functions in adminController.js

1. **getAdminProfile()**
   - Fetches current admin's profile
   - Excludes password field
   - Returns 404 if not found

2. **updateAdminProfile()**
   - Updates profile information
   - Validates firstName and lastName
   - Uses findByIdAndUpdate with validators
   - Returns updated admin data

3. **changePassword()**
   - Verifies current password
   - Validates new password requirements
   - Checks password confirmation
   - Updates with pre-save hashing

4. **getSystemSettings()**
   - Returns system configuration
   - Hard-coded for now (can be expanded)
   - Includes app info and settings

### Routes Added to adminRoutes.js

```javascript
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.put('/change-password', changePassword);
router.get('/settings', getSystemSettings);
```

## Future Enhancements

1. **Two-Factor Authentication**
   - Add 2FA setup option
   - Security key management

2. **Activity Log**
   - View login history
   - Track profile changes
   - Audit trail

3. **API Keys**
   - Generate API tokens
   - Manage third-party integrations

4. **Backup Management**
   - Create manual backups
   - View backup history
   - Restore from backup

5. **System Maintenance**
   - Enable/disable maintenance mode
   - Configure system settings
   - Manage scheduled tasks

6. **Advanced Preferences**
   - Theme selection (light/dark)
   - Language preferences
   - Date/time format options

## Testing Checklist

- [ ] Profile form loads with current data
- [ ] Can update first and last name
- [ ] Phone and address optional fields save
- [ ] Email field is read-only
- [ ] Can change password successfully
- [ ] Password confirmation validation works
- [ ] Current password must match
- [ ] New password minimum length enforced
- [ ] System settings display correctly
- [ ] Notifications can be toggled
- [ ] Success messages appear
- [ ] Error messages display properly
- [ ] Responsive on mobile devices
- [ ] All API endpoints return correct data
- [ ] Authentication required for all endpoints

## Common Issues & Solutions

### Issue: Profile not loading
**Solution:** Check browser console for fetch errors, verify auth token in localStorage

### Issue: Password change fails
**Solution:** Ensure current password is correct, new password is 6+ characters

### Issue: Settings not saving
**Solution:** Check network tab in dev tools, verify API endpoint is accessible

### Issue: Notification preferences not persisting
**Solution:** Currently implemented as UI preference, expand backend for persistence

## Support

For issues or feature requests related to admin settings:
1. Check browser console for error messages
2. Verify API endpoints are accessible
3. Ensure admin user has proper permissions
4. Check network requests in browser dev tools
