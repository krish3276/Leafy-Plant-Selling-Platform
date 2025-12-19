# 🔔 Admin Notifications System Guide

## Overview

The Admin Notifications System is a comprehensive feature that tracks all important events in the Leafy Plants platform, including:
- Customer orders (placed, updated, cancelled, delivered)
- System alerts and important events
- Real-time notification management

## Architecture

### Backend Components

#### 1. **Notification Model** (`Backend/models/Notification.js`)
Defines the structure for storing notifications in MongoDB.

**Fields:**
- `adminId` - Reference to admin user
- `type` - Type of notification (order_placed, order_updated, order_cancelled, order_delivered, system_alert)
- `title` - Short title for the notification
- `message` - Detailed message content
- `relatedId` - ID of related entity (order, product, user)
- `relatedType` - Type of related entity (order, user, product, system)
- `data` - Additional JSON data specific to the notification
- `isRead` - Boolean flag for read status
- `priority` - Priority level (low, medium, high, critical)
- `createdAt` - Timestamp when created
- `readAt` - Timestamp when marked as read

**Indexes:**
- `(adminId, createdAt)` - For sorting notifications by recency
- `(adminId, isRead)` - For filtering unread notifications

#### 2. **Notification Controller** (`Backend/controllers/notificationController.js`)
Implements business logic for notification operations.

**Key Functions:**

```javascript
// Get notifications with filtering and pagination
getNotifications(req, res)
- Query Parameters:
  - filter: 'all' | 'unread' | 'read' (default: 'all')
  - limit: number (default: 10)
  - page: number (default: 1)

// Get count of unread notifications
getUnreadCount(req, res)

// Mark a specific notification as read
markAsRead(req, res)
- Route Parameter: notificationId

// Mark all notifications as read
markAllAsRead(req, res)

// Delete a specific notification
deleteNotification(req, res)
- Route Parameter: notificationId

// Delete all notifications
deleteAllNotifications(req, res)

// Get notification statistics
getNotificationStats(req, res)
- Returns counts by type and priority
```

#### 3. **Notification Routes** (`Backend/routes/notificationRoutes.js`)
RESTful API endpoints for notification management.

**Endpoints:**

```
GET    /api/notifications                  - Get notifications
GET    /api/notifications/unread/count     - Get unread count
GET    /api/notifications/stats             - Get statistics
PUT    /api/notifications/:id/read          - Mark as read
PUT    /api/notifications/all/read          - Mark all as read
DELETE /api/notifications/:id               - Delete notification
DELETE /api/notifications/all               - Delete all notifications
```

All endpoints require:
- JWT authentication (`Authorization: Bearer <token>`)
- Admin role (`role: 'admin'`)

#### 4. **Notification Helper** (`Backend/utils/notificationHelper.js`)
Utility functions to create notifications from other parts of the application.

**Functions:**

```javascript
// Order events
notifyOrderPlaced(adminId, orderData)
notifyOrderUpdated(adminId, orderData)
notifyOrderCancelled(adminId, orderData)
notifyOrderDelivered(adminId, orderData)

// System events
notifySystemAlert(adminId, title, message, priority)

// Utility functions
getAdminId()
notifyAllAdmins(adminIds, type, title, message, data, priority)
```

### Frontend Components

#### 1. **AdminNotifications Component** (`Frontend/src/components/Admin/AdminNotifications.jsx`)
Main notification management UI component.

**Features:**
- Display notifications with pagination
- Filter by status (All, Unread, Read)
- Real-time unread count
- Statistics dashboard
- Mark as read functionality
- Delete notification functionality
- Auto-refresh every 10 seconds
- Responsive mobile design

**Props:** None (uses localStorage for authentication)

#### 2. **AdminNotifications CSS** (`Frontend/src/styles/AdminNotifications.css`)
Professional styling with:
- Color-coded priority badges
- Animation effects
- Responsive layout
- Mobile-first design

#### 3. **Integration Points**
- Added to `AdminDashboard.jsx` as "Notifications" tab
- Added to `AdminSidebar.jsx` with bell icon
- Shows unread count badge on tab

## Usage Examples

### Creating Order Notifications

```javascript
// In order creation endpoint
import { notifyOrderPlaced } from '../utils/notificationHelper.js';

const adminId = await getAdminId(); // Get first admin
await notifyOrderPlaced(adminId, {
  orderId: order._id,
  customerName: 'John Doe',
  itemCount: 3,
  totalPrice: 1500,
});
```

### Creating System Alerts

```javascript
import { notifySystemAlert } from '../utils/notificationHelper.js';

await notifySystemAlert(
  adminId,
  'Low Stock Alert',
  'Tomato plant stock is running low',
  'high'
);
```

### Using in Cart Checkout

```javascript
// When customer completes checkout
const order = await Order.create({
  userId: req.user.id,
  items: cart,
  totalPrice: cartTotal,
  status: 'pending',
});

// Notify admin
await notifyOrderPlaced(adminId, {
  orderId: order._id,
  customerName: user.firstName + ' ' + user.lastName,
  itemCount: cart.length,
  totalPrice: order.totalPrice,
});
```

## API Request/Response Examples

### Get Notifications

**Request:**
```bash
curl -X GET 'http://localhost:5000/api/notifications?filter=unread&page=1&limit=10' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

**Response (Success):**
```json
{
  "success": true,
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "adminId": "507f1f77bcf86cd799439010",
      "type": "order_placed",
      "title": "New Order #439011",
      "message": "John Doe placed an order with 3 items - ₹1500",
      "relatedId": "507f1f77bcf86cd799439012",
      "relatedType": "order",
      "priority": "high",
      "isRead": false,
      "createdAt": "2024-12-20T10:30:00Z",
      "readAt": null,
      "data": {
        "customerName": "John Doe",
        "itemCount": 3,
        "totalPrice": 1500
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### Get Unread Count

**Request:**
```bash
curl -X GET 'http://localhost:5000/api/notifications/unread/count' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "unreadCount": 5
}
```

### Mark as Read

**Request:**
```bash
curl -X PUT 'http://localhost:5000/api/notifications/507f1f77bcf86cd799439011/read' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "notification": { /* notification object */ }
}
```

### Get Statistics

**Request:**
```bash
curl -X GET 'http://localhost:5000/api/notifications/stats' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalCount": 45,
    "unreadCount": 5,
    "byType": [
      { "_id": "order_placed", "count": 30 },
      { "_id": "order_updated", "count": 10 },
      { "_id": "system_alert", "count": 5 }
    ],
    "byPriority": [
      { "_id": "high", "count": 15 },
      { "_id": "medium", "count": 20 },
      { "_id": "low", "count": 10 }
    ]
  }
}
```

## Features Implemented

✅ **Backend Infrastructure**
- MongoDB notifications model with proper schema
- Complete CRUD operations with filtering
- Pagination support
- Statistics aggregation
- JWT authentication and admin role validation

✅ **Frontend UI**
- Notification list with real-time updates
- Filter by status (All, Unread, Read)
- Mark as read/read all functionality
- Delete notification/delete all functionality
- Unread count badge
- Priority-based color coding
- Statistics dashboard
- Auto-refresh every 10 seconds
- Responsive design (desktop, tablet, mobile)

✅ **Integration**
- Added Notifications tab to Admin Dashboard
- Added Notifications menu item to Admin Sidebar
- Notification helper utilities for easy event triggering
- Proper error handling and user feedback

## Features To Be Implemented

⏳ **Order Integration**
- Wire notification creation to order placement endpoint
- Wire notification creation to order status update endpoint
- Wire notification creation to order cancellation endpoint
- Wire notification creation to order delivery endpoint

⏳ **Real-time Updates (Advanced)**
- WebSocket integration for instant notifications
- Server-sent events (SSE) for real-time updates
- Notification sound effects
- Browser push notifications

⏳ **Email Notifications**
- Send email when important notifications are created
- Configurable email preferences
- Email digest/summary notifications

⏳ **Notification Preferences**
- Admin can choose notification types
- Customize notification frequency
- Do Not Disturb hours
- Email notification preferences

## Database Indexes

The Notification model includes optimized indexes:

```javascript
// Sort notifications by creation date (newest first)
index({ adminId: 1, createdAt: -1 })

// Quick filtering of unread notifications
index({ adminId: 1, isRead: 1 })
```

These ensure fast queries even with large numbers of notifications.

## Security Considerations

1. **Authentication Required** - All notification endpoints require valid JWT token
2. **Admin Only** - All endpoints check for admin role
3. **Data Isolation** - Each admin only sees their own notifications
4. **Input Validation** - All parameters validated before processing
5. **Error Handling** - No sensitive data leaked in error messages

## Performance Optimization

- **Pagination** - Prevents loading all notifications at once
- **Lean Queries** - Select only necessary fields
- **Indexing** - Database indexes for common queries
- **Polling Interval** - 10-second auto-refresh balances real-time feel with server load
- **Filtering** - Server-side filtering reduces data transfer

## Testing the System

1. **Test Unread Count:**
   ```bash
   # Should return count of unread notifications
   curl -H 'Authorization: Bearer TOKEN' \
     http://localhost:5000/api/notifications/unread/count
   ```

2. **Test Filtering:**
   ```bash
   # Get only unread notifications
   curl -H 'Authorization: Bearer TOKEN' \
     'http://localhost:5000/api/notifications?filter=unread'
   ```

3. **Test Statistics:**
   ```bash
   # Get notification stats
   curl -H 'Authorization: Bearer TOKEN' \
     http://localhost:5000/api/notifications/stats
   ```

## Troubleshooting

**No notifications showing?**
- Verify admin is logged in with correct JWT token
- Check browser console for API errors
- Ensure backend server is running

**Unread count not updating?**
- Check that notifications are being created with `isRead: false`
- Verify page is auto-refreshing (check network tab)
- Clear browser cache and reload

**Notifications not getting created?**
- Verify order endpoints are calling the notification helper
- Check that admin user exists in database
- Look at backend console for errors

## Next Steps

1. **Integrate with Orders Module**
   - Add checkout endpoint that creates order
   - Add notification trigger when order is created

2. **Add Email Integration**
   - Send emails for critical notifications
   - Add email preference settings

3. **Implement Real-time Updates**
   - Add WebSocket support with Socket.io
   - Eliminate polling in favor of instant updates

4. **Add Notification Preferences**
   - Let admins customize which events trigger notifications
   - Add notification scheduling (do not disturb hours)
