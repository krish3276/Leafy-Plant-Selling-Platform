# ⚙️ Admin Settings - Quick Reference Card

## 🎯 Quick Start

### Access Settings
```
Admin Dashboard → Click "Settings" in sidebar
or
Dashboard → Click Settings tab
```

### Admin Credentials
```
Email: admin@leafy.com
Password: Admin@123456
```

---

## 📑 Settings Sections

### 1️⃣ Profile Tab 👤
**What:** Update personal information
**Fields:**
- First Name (required)
- Last Name (required)
- Phone (optional)
- Address (optional)
- Email (view-only)

**Action:** Click "Save Profile"

### 2️⃣ Security Tab 🔐
**What:** Change admin password
**Fields:**
- Current Password
- New Password (8-128 chars)
- Confirm Password

**Requirements:**
- Current password must be correct
- New passwords must match
- Min 6 characters

**Action:** Click "Change Password"

### 3️⃣ System Tab ⚙️
**What:** View system configuration
**Shows:**
- App Name & Version
- System Settings
- Backup Schedule
- Maintenance Status
- System Health

**Permissions:** View-only (no editing)

### 4️⃣ Notifications Tab 🔔
**What:** Manage notification preferences
**Options:**
- 📧 Email Notifications
- 📱 Push Notifications
- 🛒 Order Notifications
- 📦 Product Updates
- ⚠️ Critical Alerts (always on)

**Action:** Toggle switches, then "Save Preferences"

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/profile` | Get profile info |
| PUT | `/api/admin/profile` | Update profile |
| PUT | `/api/admin/change-password` | Change password |
| GET | `/api/admin/settings` | Get system settings |

**All endpoints require:** `Authorization: Bearer <token>`

---

## 🎨 UI Elements

### Buttons
- 💾 **Save Profile** - Dark green button
- 🔐 **Change Password** - Dark green button
- 💾 **Save Preferences** - Dark green button

### Notifications
- ✅ **Green** - Success message
- ⚠️ **Red** - Error message

### Toggles
- 🟢 **ON** - Enabled (green)
- ⚪ **OFF** - Disabled (gray)

---

## ✅ Validation Rules

### Profile
- ✅ First Name: Required, max 50 chars
- ✅ Last Name: Required, max 50 chars
- ✅ Phone: Optional
- ✅ Address: Optional

### Password
- ✅ Current: Must match
- ✅ New: Min 6 characters
- ✅ Confirm: Must match new password

---

## 🛠️ Components

**Frontend:**
- `AdminSettings.jsx` - Main component (560+ lines)
- `AdminSettings.css` - Styling (600+ lines)

**Backend:**
- `adminController.js` - 4 new functions
- `adminRoutes.js` - 4 new routes

---

## 🔒 Security

✅ JWT authentication required
✅ Admin role verification
✅ Password hashing (bcryptjs)
✅ Current password verification
✅ Email read-only
✅ Input validation & sanitization

---

## 📱 Responsive

- **Desktop** (1200px+) - 2-column layout
- **Tablet** (768px) - 1-column layout
- **Mobile** (<768px) - Single column, full width

---

## 🎓 File Locations

```
Frontend:
  src/components/Admin/AdminSettings.jsx
  src/styles/AdminSettings.css

Backend:
  controllers/adminController.js
  routes/adminRoutes.js

Docs:
  ADMIN_SETTINGS_GUIDE.md
  ADMIN_SETTINGS_IMPLEMENTATION.md
  ADMIN_SETTINGS_UI_GUIDE.md
```

---

## 🚀 Common Tasks

### Update Name
1. Click Profile tab
2. Edit First Name & Last Name
3. Click "Save Profile"
4. See ✅ confirmation

### Change Password
1. Click Security tab
2. Enter current password
3. Enter new password (6+ chars)
4. Confirm password
5. Click "Change Password"
6. See ✅ confirmation

### Toggle Notifications
1. Click Notifications tab
2. Click toggle switches
3. Click "Save Preferences"
4. See ✅ confirmation

### View System Info
1. Click System tab
2. Read information (view-only)
3. No editing available

---

## ❌ Common Errors

| Error | Solution |
|-------|----------|
| "First name and last name required" | Fill both name fields |
| "Current password is incorrect" | Check current password |
| "New passwords do not match" | Confirm password exactly |
| "New password must be at least 8 characters" | Use 8-128 character password |
| "All password fields required" | Fill all 3 password fields |

---

## 💾 Data Stored

### Profile Information
- ✅ First Name
- ✅ Last Name
- ✅ Phone
- ✅ Address
- ✅ Updated timestamp

### Security
- ✅ Password (hashed, never plain text)
- ✅ Last password change date
- ✅ Login attempts

### Preferences
- ✅ Email notifications
- ✅ Push notifications
- ✅ Order alerts
- ✅ Product updates

---

## 🎯 Best Practices

1. **Security**
   - Change password monthly
   - Use strong passwords (8+ chars)
   - Don't share credentials
   - Logout after session

2. **Maintenance**
   - Keep contact info current
   - Review notifications regularly
   - Check system status
   - Monitor login activity

3. **Settings**
   - Enable critical alerts
   - Customize other alerts as needed
   - Update address if moving
   - Keep phone number current

---

## 📊 Performance

- ✅ Fast API responses
- ✅ Optimized CSS
- ✅ Lazy loading
- ✅ Minimal re-renders
- ✅ Efficient validation

---

## 🌐 Browser Support

✅ Chrome/Chromium
✅ Firefox
✅ Safari
✅ Edge
✅ Mobile browsers (iOS/Android)

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| ADMIN_SETTINGS_GUIDE.md | Complete documentation |
| ADMIN_SETTINGS_IMPLEMENTATION.md | Implementation details |
| ADMIN_SETTINGS_UI_GUIDE.md | Visual UI/UX guide |
| ADMIN_SETTINGS_COMPLETE.md | Full summary |

---

## ⚡ Tips & Tricks

**Show Password:**
- Click 👁️ icon to reveal password while typing

**Auto-dismiss:**
- Notifications auto-hide after 3 seconds

**Tab Navigation:**
- Use keyboard arrow keys to switch tabs

**Mobile View:**
- Swipe or tap to navigate tabs

---

## 🔄 Version Info

- **Version:** 1.0.0
- **Created:** December 19, 2025
- **Status:** Production Ready ✅
- **Last Updated:** December 19, 2025

---

## 📞 Need Help?

1. Check documentation files
2. Review browser console errors
3. Verify API endpoints
4. Check authentication token
5. Ensure admin role permissions

**All set! Enjoy the Admin Settings feature! 🎉**
