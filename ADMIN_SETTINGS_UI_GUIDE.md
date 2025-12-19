# 🎨 Admin Settings UI Guide

## Navigation

### Accessing Settings
1. Login to admin dashboard
2. In the sidebar, click "⚙️ Settings"
3. Or click the Settings tab in the admin interface

## Settings Interface Layout

### Tab Navigation
```
┌─────────────────────────────────────────┐
│ 👤 Profile | 🔐 Security | ⚙️ System | 🔔 Notifications │
└─────────────────────────────────────────┘
```

---

## Section 1: Profile Management 👤

### Display

```
┌────────────────────────────────────────────────┐
│ 👤 Profile Information                         │
│ Manage your personal information               │
│                                                │
│ ┌──────────────┐  ┌──────────────┐          │
│ │ First Name   │  │ Last Name    │          │
│ │ [Input]      │  │ [Input]      │          │
│ └──────────────┘  └──────────────┘          │
│                                                │
│ Email Address                                  │
│ [input@leafy.com] (disabled - greyed out)    │
│ Email address cannot be changed               │
│                                                │
│ Phone Number                                   │
│ [+91-9000000000] (optional)                  │
│                                                │
│ Address                                        │
│ [Large text area with address] (optional)    │
│                                                │
│ [💾 Save Profile] button                      │
└────────────────────────────────────────────────┘
```

### User Actions
1. Type in first name field
2. Type in last name field
3. Enter phone (optional)
4. Enter address (optional)
5. Click **Save Profile** button
6. See notification: "✅ Profile updated successfully!"

### Validation
- ✅ First name required
- ✅ Last name required
- ✅ Phone optional
- ✅ Address optional

---

## Section 2: Security Settings 🔐

### Display

```
┌────────────────────────────────────────────────┐
│ 🔐 Change Password                             │
│ Update your login password                     │
│                                                │
│ Current Password                               │
│ [••••••••••] [👁️ Show]                         │
│                                                │
│ New Password                                   │
│ [••••••••••] [👁️ Show]                         │
│                                                │
│ Confirm New Password                           │
│ [••••••••••] [👁️ Show]                         │
│                                                │
│ ┌─ Password requirements ─────────────────┐  │
│ │ ✓ At least 6 characters long            │  │
│ │ ✓ Must be different from current        │  │
│ │ ✓ New password and confirm must match   │  │
│ └────────────────────────────────────────┘  │
│                                                │
│ [🔐 Change Password] button                    │
└────────────────────────────────────────────────┘
```

### User Actions
1. Enter current password
2. Click eye icon to show password (optional)
3. Enter new password (min 6 characters)
4. Click eye icon to show (optional)
5. Re-enter password to confirm
6. Click **Change Password** button
7. See notification: "✅ Password changed successfully!"

### Validation
- ✅ Current password must be correct
- ✅ New password min 6 characters
- ✅ Passwords must match
- ✅ Can't be same as current

### Error Messages
- ❌ "Current password is incorrect"
- ❌ "New passwords do not match"
- ❌ "New password must be at least 6 characters"

---

## Section 3: System Settings ⚙️

### Display

```
┌────────────────────────────────────────────────┐
│ ⚙️ System Settings                             │
│ View and manage system configuration           │
│                                                │
│ ┌──────────────────┐ ┌──────────────────┐   │
│ │ Application Info │ │ Configuration    │   │
│ │ ─────────────── │ │ ──────────────── │   │
│ │ App Name:       │ │ Max Login        │   │
│ │   Leafy Plants  │ │   Attempts: 5    │   │
│ │                 │ │                  │   │
│ │ Version:        │ │ Session Timeout: │   │
│ │   1.0.0         │ │   30 minutes     │   │
│ │                 │ │                  │   │
│ │                 │ │ Products Per     │   │
│ │                 │ │ Page: 10         │   │
│ └──────────────────┘ └──────────────────┘   │
│                                                │
│ ┌──────────────────┐                          │
│ │ Backup &         │                          │
│ │ Maintenance      │                          │
│ │ ──────────────── │                          │
│ │ Backup Schedule: │                          │
│ │   Daily          │                          │
│ │                  │                          │
│ │ Maintenance Mode │                          │
│ │   OFF (green)    │                          │
│ └──────────────────┘                          │
│                                                │
│ ┌─ System Status ──────────────────────────┐ │
│ │ ● All systems operational                │ │
│ └───────────────────────────────────────────┘ │
│                                                │
│ (View-only section - no editing)               │
└────────────────────────────────────────────────┘
```

### Features
- 📱 App Name: "Leafy Plants"
- 📦 Version: "1.0.0"
- 🔒 Max Login Attempts: 5
- ⏱️ Session Timeout: 30 minutes
- 📊 Products Per Page: 10
- 💾 Backup Schedule: Daily
- 🛠️ Maintenance Mode: OFF
- ✅ System Status: Operational

### Color Indicators
- 🟢 **GREEN**: System operational, feature enabled
- 🔴 **RED**: System issue, feature disabled
- 🟡 **YELLOW**: Warning, check status

---

## Section 4: Notification Settings 🔔

### Display

```
┌────────────────────────────────────────────────┐
│ 🔔 Notification Settings                       │
│ Control how and when you receive notifications │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ 📧 Email Notifications         [Toggle] │ │
│ │ Receive email alerts for important      │ │
│ │ events and updates                      │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ 📱 Push Notifications          [Toggle] │ │
│ │ In-browser push notifications for       │ │
│ │ real-time updates                       │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ 🛒 Order Notifications         [Toggle] │ │
│ │ Get notified when new orders are placed │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ 📦 Product Updates             [Toggle] │ │
│ │ Notifications about product stock       │ │
│ │ changes                                 │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ ⚠️ Critical Alerts            [Toggle]  │ │
│ │ Important system alerts and errors      │ │
│ │ (always enabled)                        │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ [💾 Save Preferences] button                   │
└────────────────────────────────────────────────┘
```

### Toggle Switch States

**OFF (Default)**
```
┌─────────┐
│●        │  (Disabled)
└─────────┘
```

**ON (Enabled)**
```
┌─────────┐
│        ●│  (Enabled)
└─────────┘
```

### User Actions
1. Click toggle switches to enable/disable
2. Click **Save Preferences** button
3. See notification: "✅ Notification settings saved!"

---

## Notifications & Feedback

### Success Notification
```
┌─────────────────────────────────────────────┐
│ ✅ Profile updated successfully!            │
└─────────────────────────────────────────────┘
```

### Error Notification
```
┌─────────────────────────────────────────────┐
│ ⚠️ Current password is incorrect            │
└─────────────────────────────────────────────┘
```

### Loading State
```
Button shows: [💾 Saving...]
(Button is disabled while saving)
```

---

## Responsive Behavior

### Desktop (1200px+)
- Two-column form layout
- Full navigation tabs visible
- Max-width container (1000px)

### Tablet (768px-1199px)
- Single-column form layout
- Wrapped navigation tabs
- Full width with padding

### Mobile (< 768px)
- Single column
- Full-width inputs
- Stacked notification items
- Touch-friendly buttons (min 44px height)

---

## Color Scheme

- **Primary Green**: `#2d5f3f` (buttons, active tabs)
- **Dark Green**: `#1a3a26` (hover states)
- **Light Green**: `#a8d5ba` (accents, highlights)
- **Success Green**: `#28a745` (notifications)
- **Error Red**: `#dc3545` (error messages)
- **Background**: `#fafaf8` (page background)
- **Text**: `#333333` (main text)
- **Muted**: `#999999` (secondary text)

---

## Icon Legend

- 👤 = Profile
- 🔐 = Security/Password
- ⚙️ = System Settings
- 🔔 = Notifications
- 💾 = Save
- 👁️ = Show/Hide
- ✅ = Success
- ⚠️ = Warning/Error
- ● = Status indicator

---

## Interaction Flow

### Example: Update Profile

```
1. Click Settings tab
   ↓
2. Profile tab is active by default
   ↓
3. Edit fields (first name, last name, phone, address)
   ↓
4. Click "Save Profile" button
   ↓
5. Button shows "Saving..." (disabled)
   ↓
6. API call to: PUT /api/admin/profile
   ↓
7. Server validates and updates
   ↓
8. Success response received
   ↓
9. Green notification: "✅ Profile updated successfully!"
   ↓
10. Notification auto-dismisses after 3 seconds
```

### Example: Change Password

```
1. Click "Security" tab
   ↓
2. See "Change Password" section
   ↓
3. Enter current password: Admin@123456
   ↓
4. Enter new password: NewPass@123
   ↓
5. Confirm password: NewPass@123
   ↓
6. Click "Change Password" button
   ↓
7. Button shows "Changing..." (disabled)
   ↓
8. API call to: PUT /api/admin/change-password
   ↓
9. Server verifies current password and updates
   ↓
10. Success response received
    ↓
11. Green notification: "✅ Password changed successfully!"
    ↓
12. Form clears automatically
```

---

## Accessibility Features

✅ Keyboard navigation (Tab through fields)
✅ Label associations (click label to focus input)
✅ Clear error messages
✅ Color + text indicators (not just color)
✅ Sufficient contrast ratios
✅ Responsive touch targets
✅ Screen reader friendly

---

## Best Practices

1. **Always verify current password before changing it**
   - Prevents unauthorized password changes

2. **Keep email read-only**
   - Email is your account identity

3. **Use strong new passwords**
   - At least 8 characters recommended
   - Mix of letters, numbers, symbols

4. **Regularly update contact information**
   - Keep phone and address current

5. **Review notifications regularly**
   - Enable only what you need

6. **Don't share your password**
   - Only you should know your password
