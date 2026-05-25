/**
 * 🔔 ADMIN NOTIFICATION ENDPOINTS REFERENCE
 * Comprehensive guide for Admin Notification Preferences API
 * 
 * Base URL: /api/admin/notifications
 * All endpoints require: Authentication + Admin Role
 */

// ============================================
// 1. GET NOTIFICATION PREFERENCES
// ============================================
/**
 * GET /api/admin/notifications/preferences
 * 
 * Description: Retrieve all notification preferences for the current admin
 * Authentication: Required (Admin)
 * 
 * Response Success (200):
 * {
 *   "success": true,
 *   "preferences": {
 *     "_id": "mongodb-id",
 *     "adminId": "admin-user-id",
 *     "preferences": {
 *       "orderPlaced": {
 *         "enabled": true,
 *         "email": true,
 *         "push": true,
 *         "inApp": true
 *       },
 *       "orderUpdated": {
 *         "enabled": true,
 *         "email": true,
 *         "push": true,
 *         "inApp": true
 *       },
 *       "orderCancelled": {
 *         "enabled": true,
 *         "email": true,
 *         "push": false,
 *         "inApp": true
 *       },
 *       "orderDelivered": {
 *         "enabled": true,
 *         "email": true,
 *         "push": true,
 *         "inApp": true
 *       },
 *       "systemAlert": {
 *         "enabled": true,
 *         "email": true,
 *         "push": true,
 *         "inApp": true
 *       },
 *       "productUpdates": {
 *         "enabled": true,
 *         "email": false,
 *         "push": true,
 *         "inApp": true
 *       }
 *     },
 *     "globalSettings": {
 *       "quietHoursEnabled": false,
 *       "quietHoursStart": "22:00",
 *       "quietHoursEnd": "08:00",
 *       "frequency": "immediate",
 *       "doNotDisturb": false,
 *       "soundEnabled": true,
 *       "desktopNotifications": true
 *     },
 *     "lastUpdated": "2024-05-13T10:30:00Z"
 *   }
 * }
 * 
 * Response Error (500):
 * {
 *   "success": false,
 *   "message": "Server error",
 *   "error": "Error details"
 * }
 */


// ============================================
// 2. UPDATE SPECIFIC NOTIFICATION TYPE
// ============================================
/**
 * PUT /api/admin/notifications/preferences/type
 * 
 * Description: Update notification preferences for a specific notification type
 * Authentication: Required (Admin)
 * 
 * Request Body:
 * {
 *   "notificationType": "orderPlaced",  // Required: one of: orderPlaced, orderUpdated, orderCancelled, orderDelivered, systemAlert, productUpdates
 *   "enabled": true,                    // Optional: Enable/disable this notification type
 *   "email": true,                      // Optional: Enable email for this type
 *   "push": true,                       // Optional: Enable push for this type
 *   "inApp": true                       // Optional: Enable in-app for this type
 * }
 * 
 * Example 1: Disable email notifications for orders
 * {
 *   "notificationType": "orderPlaced",
 *   "email": false
 * }
 * 
 * Example 2: Disable entire notification type
 * {
 *   "notificationType": "orderUpdated",
 *   "enabled": false
 * }
 * 
 * Response Success (200):
 * {
 *   "success": true,
 *   "message": "orderPlaced preferences updated successfully",
 *   "preferences": { ... updated preferences object ... }
 * }
 * 
 * Response Error (400):
 * {
 *   "success": false,
 *   "message": "Invalid notification type. Must be one of: orderPlaced, orderUpdated, ..."
 * }
 */


// ============================================
// 3. UPDATE ALL NOTIFICATION PREFERENCES
// ============================================
/**
 * PUT /api/admin/notifications/preferences/all
 * 
 * Description: Update all notification preferences at once
 * Authentication: Required (Admin)
 * 
 * Request Body:
 * {
 *   "preferences": {
 *     "orderPlaced": { "enabled": true, "email": true, "push": true, "inApp": true },
 *     "orderUpdated": { "enabled": true, "email": true, "push": true, "inApp": true },
 *     "orderCancelled": { "enabled": true, "email": true, "push": false, "inApp": true },
 *     "orderDelivered": { "enabled": true, "email": true, "push": true, "inApp": true },
 *     "systemAlert": { "enabled": true, "email": true, "push": true, "inApp": true },
 *     "productUpdates": { "enabled": true, "email": false, "push": true, "inApp": true }
 *   }
 * }
 * 
 * Response Success (200):
 * {
 *   "success": true,
 *   "message": "All notification preferences updated successfully",
 *   "preferences": { ... full preferences object ... }
 * }
 */


// ============================================
// 4. UPDATE GLOBAL NOTIFICATION SETTINGS
// ============================================
/**
 * PUT /api/admin/notifications/preferences/global
 * 
 * Description: Update global notification settings
 * Authentication: Required (Admin)
 * 
 * Request Body:
 * {
 *   "quietHoursEnabled": true,           // Optional: Enable quiet hours
 *   "quietHoursStart": "22:00",          // Optional: Start time (24-hour format HH:mm)
 *   "quietHoursEnd": "08:00",            // Optional: End time (24-hour format HH:mm)
 *   "frequency": "immediate",            // Optional: immediate, daily_digest, weekly_digest
 *   "doNotDisturb": false,               // Optional: Enable/disable do not disturb
 *   "soundEnabled": true,                // Optional: Enable/disable notification sounds
 *   "desktopNotifications": true         // Optional: Enable/disable desktop notifications
 * }
 * 
 * Example: Set quiet hours from 10 PM to 8 AM
 * {
 *   "quietHoursEnabled": true,
 *   "quietHoursStart": "22:00",
 *   "quietHoursEnd": "08:00"
 * }
 * 
 * Example: Switch to daily digest mode
 * {
 *   "frequency": "daily_digest"
 * }
 * 
 * Response Success (200):
 * {
 *   "success": true,
 *   "message": "Global notification settings updated successfully",
 *   "preferences": { ... full preferences object ... }
 * }
 * 
 * Response Error (400):
 * {
 *   "success": false,
 *   "message": "Invalid frequency. Must be: immediate, daily_digest, or weekly_digest"
 * }
 */


// ============================================
// 5. RESET NOTIFICATION PREFERENCES
// ============================================
/**
 * POST /api/admin/notifications/preferences/reset
 * 
 * Description: Reset all notification preferences to default values
 * Authentication: Required (Admin)
 * 
 * Request Body: Empty (no body required)
 * 
 * Response Success (200):
 * {
 *   "success": true,
 *   "message": "Notification preferences reset to defaults",
 *   "preferences": { ... default preferences object ... }
 * }
 * 
 * Response Error (404):
 * {
 *   "success": false,
 *   "message": "No notification preferences found"
 * }
 */


// ============================================
// 6. GET NOTIFICATION PREFERENCES SUMMARY
// ============================================
/**
 * GET /api/admin/notifications/preferences/summary
 * 
 * Description: Get a summary of notification preferences with statistics
 * Authentication: Required (Admin)
 * 
 * Response Success (200):
 * {
 *   "success": true,
 *   "summary": {
 *     "enabledNotifications": ["orderPlaced", "orderUpdated", "systemAlert"],
 *     "disabledNotifications": ["productUpdates"],
 *     "emailEnabled": 5,          // Count of notification types with email enabled
 *     "pushEnabled": 4,           // Count of notification types with push enabled
 *     "inAppEnabled": 6,          // Count of notification types with in-app enabled
 *     "globalSettings": {
 *       "quietHoursEnabled": false,
 *       "quietHoursStart": "22:00",
 *       "quietHoursEnd": "08:00",
 *       "frequency": "immediate",
 *       "doNotDisturb": false,
 *       "soundEnabled": true,
 *       "desktopNotifications": true
 *     }
 *   },
 *   "fullPreferences": { ... complete preferences object ... }
 * }
 */


// ============================================
// NOTIFICATION TYPES
// ============================================
/**
 * Available Notification Types:
 * 
 * 1. orderPlaced - New order has been placed
 *    Default: All channels enabled
 * 
 * 2. orderUpdated - Order status has been updated
 *    Default: All channels enabled
 * 
 * 3. orderCancelled - Customer cancelled their order
 *    Default: Email & In-app enabled, Push disabled
 * 
 * 4. orderDelivered - Order has been delivered
 *    Default: All channels enabled
 * 
 * 5. systemAlert - Important system alerts and errors
 *    Default: All channels enabled
 * 
 * 6. productUpdates - Product stock and information changes
 *    Default: Email disabled, Push & In-app enabled
 */


// ============================================
// FREQUENCY OPTIONS
// ============================================
/**
 * Notification Frequency Settings:
 * 
 * 1. immediate - Receive notifications instantly
 * 
 * 2. daily_digest - Receive a daily summary of all notifications
 * 
 * 3. weekly_digest - Receive a weekly summary of all notifications
 */


// ============================================
// DELIVERY CHANNELS
// ============================================
/**
 * Notification Delivery Channels:
 * 
 * 1. email - Receive email notifications
 * 
 * 2. push - Receive browser/device push notifications
 * 
 * 3. inApp - Receive in-app notifications
 */


// ============================================
// DEFAULT PREFERENCES
// ============================================
/**
 * Default Notification Preferences when created:
 * 
 * Order Notifications:
 * - orderPlaced: All channels ON
 * - orderUpdated: All channels ON
 * - orderCancelled: Email + In-app ON, Push OFF
 * - orderDelivered: All channels ON
 * 
 * System Notifications:
 * - systemAlert: All channels ON
 * - productUpdates: Email OFF, Push + In-app ON
 * 
 * Global Settings:
 * - quietHoursEnabled: OFF
 * - quietHoursStart: 22:00
 * - quietHoursEnd: 08:00
 * - frequency: immediate
 * - doNotDisturb: OFF
 * - soundEnabled: ON
 * - desktopNotifications: ON
 */


// ============================================
// CURL EXAMPLES
// ============================================

// Get preferences
// curl -X GET http://localhost:5000/api/admin/notifications/preferences \
//   -H "Authorization: Bearer YOUR_TOKEN"

// Update email preference for order placed
// curl -X PUT http://localhost:5000/api/admin/notifications/preferences/type \
//   -H "Authorization: Bearer YOUR_TOKEN" \
//   -H "Content-Type: application/json" \
//   -d '{
//     "notificationType": "orderPlaced",
//     "email": false
//   }'

// Enable quiet hours
// curl -X PUT http://localhost:5000/api/admin/notifications/preferences/global \
//   -H "Authorization: Bearer YOUR_TOKEN" \
//   -H "Content-Type: application/json" \
//   -d '{
//     "quietHoursEnabled": true,
//     "quietHoursStart": "22:00",
//     "quietHoursEnd": "08:00"
//   }'

// Get summary
// curl -X GET http://localhost:5000/api/admin/notifications/preferences/summary \
//   -H "Authorization: Bearer YOUR_TOKEN"

// Reset to defaults
// curl -X POST http://localhost:5000/api/admin/notifications/preferences/reset \
//   -H "Authorization: Bearer YOUR_TOKEN"
