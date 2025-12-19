# 🔔 Notifications Quick Reference

## Frontend Usage

### Display Notifications in Admin Dashboard
```jsx
import AdminNotifications from '../components/Admin/AdminNotifications';

// In AdminDashboard.jsx
{activeTab === 'notifications' && (
  <AdminNotifications />
)}
```

### Get Notifications via API
```javascript
// Fetch notifications
const response = await fetch(
  'http://localhost:5000/api/notifications?filter=unread&limit=10&page=1',
  {
    headers: { 'Authorization': `Bearer ${token}` },
  }
);
const data = await response.json();
```

### Get Unread Count
```javascript
const response = await fetch(
  'http://localhost:5000/api/notifications/unread/count',
  {
    headers: { 'Authorization': `Bearer ${token}` },
  }
);
const { unreadCount } = await response.json();
```

## Backend Usage

### Import Notification Helpers
```javascript
import {
  notifyOrderPlaced,
  notifyOrderUpdated,
  notifyOrderCancelled,
  notifyOrderDelivered,
  notifySystemAlert,
  getAdminId,
} from '../utils/notificationHelper.js';
```

### Create Order Placed Notification
```javascript
const adminId = await getAdminId();
await notifyOrderPlaced(adminId, {
  orderId: order._id,
  customerName: 'John Doe',
  itemCount: 3,
  totalPrice: 1500,
});
```

### Create System Alert
```javascript
const adminId = await getAdminId();
await notifySystemAlert(
  adminId,
  'Alert Title',
  'Alert message content',
  'high' // low, medium, high, critical
);
```

### Create in Order Controller
```javascript
// In checkout/order creation endpoint
const order = await Order.create({
  userId: req.user.id,
  items: cart,
  totalPrice: totalAmount,
  status: 'pending',
});

// Notify admin
const user = await User.findById(req.user.id);
const adminId = await getAdminId();
await notifyOrderPlaced(adminId, {
  orderId: order._id,
  customerName: `${user.firstName} ${user.lastName}`,
  itemCount: cart.length,
  totalPrice: order.totalPrice,
});

res.json({ success: true, order });
```

## Notification Types & Priorities

### Types (for type field)
- `order_placed` - New order from customer
- `order_updated` - Order status changed
- `order_cancelled` - Customer cancelled order
- `order_delivered` - Order delivered to customer
- `system_alert` - Important system events

### Priority Levels
- `critical` - Needs immediate attention (red)
- `high` - Important, should review soon (orange)
- `medium` - Normal priority (green)
- `low` - Informational (blue)

## API Endpoints

### Get Notifications
```
GET /api/notifications
Query: ?filter=all|unread|read&limit=10&page=1
```

### Get Unread Count
```
GET /api/notifications/unread/count
```

### Get Statistics
```
GET /api/notifications/stats
```

### Mark as Read
```
PUT /api/notifications/:notificationId/read
```

### Mark All as Read
```
PUT /api/notifications/all/read
```

### Delete Notification
```
DELETE /api/notifications/:notificationId
```

### Delete All
```
DELETE /api/notifications/all
```

## Database Model

```javascript
{
  adminId: ObjectId,        // Reference to admin user
  type: 'order_placed',     // Type of notification
  title: 'New Order #12345', // Short title
  message: 'Customer John placed order...', // Full message
  relatedId: ObjectId,      // ID of related entity
  relatedType: 'order',     // Type of related entity
  data: {                   // Additional data
    customerName: 'John',
    itemCount: 3,
    totalPrice: 1500
  },
  isRead: false,            // Read status
  priority: 'high',         // Priority level
  createdAt: Date,          // Creation timestamp
  readAt: Date | null       // When marked as read
}
```

## Frontend Components

### AdminNotifications.jsx
Location: `src/components/Admin/AdminNotifications.jsx`
- Main notification display component
- Features: Filter, pagination, mark as read, delete
- Auto-refreshes every 10 seconds

### AdminNotifications.css
Location: `src/styles/AdminNotifications.css`
- Professional styling
- Responsive design
- Color-coded priority badges

### Integration in AdminDashboard
- Added as "Notifications" tab
- Accessible from sidebar menu
- Shows unread badge

## Configuration

### Auto-refresh Interval (Frontend)
In `AdminNotifications.jsx`, change interval:
```javascript
// Fetch every 10 seconds
const interval = setInterval(() => {
  fetchNotifications();
  fetchUnreadCount();
}, 10000); // milliseconds
```

### Pagination Limit (Frontend)
In `AdminNotifications.jsx`:
```javascript
// Change limit from 10 to 20
const response = await fetch(`${API_BASE}?filter=${filter}&page=${page}&limit=20`, ...);
```

## Error Handling

### Common Errors

**401 Unauthorized**
- Invalid or missing JWT token
- Solution: Re-login to get fresh token

**403 Forbidden**
- User is not an admin
- Solution: Ensure user has admin role

**404 Not Found**
- Notification ID doesn't exist
- Solution: Verify notification ID is correct

**500 Server Error**
- Database or server issue
- Solution: Check backend logs, restart server

## Best Practices

1. **Always Check Success**
   ```javascript
   const data = await response.json();
   if (!data.success) {
     console.error(data.message);
     return;
   }
   ```

2. **Provide User Feedback**
   ```javascript
   showNotification('✅ Marked as read', 'success');
   ```

3. **Handle Errors Gracefully**
   ```javascript
   try {
     // API call
   } catch (error) {
     console.error('Error:', error);
     showNotification('Error: ' + error.message, 'error');
   }
   ```

4. **Format Data Before Creating**
   ```javascript
   // Ensure all required fields are present
   const notification = {
     orderId: order._id,
     customerName: user.firstName + ' ' + user.lastName,
     itemCount: cart.length,
     totalPrice: parseFloat(totalPrice).toFixed(2),
   };
   ```

5. **Use Helper Functions**
   ```javascript
   // Good
   await notifyOrderPlaced(adminId, orderData);
   
   // Avoid creating Notification documents directly
   // Always use helpers for consistency
   ```

## Testing Commands

### Get Token
```bash
# Login first to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@leafy.com","password":"Admin@123456"}'
```

### Get Notifications
```bash
curl -X GET 'http://localhost:5000/api/notifications' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Unread Count
```bash
curl -X GET 'http://localhost:5000/api/notifications/unread/count' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Mark as Read
```bash
curl -X PUT 'http://localhost:5000/api/notifications/NOTIFICATION_ID/read' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

## Files Modified/Created

### Created
- `Backend/models/Notification.js` - Notification model
- `Backend/controllers/notificationController.js` - Notification logic
- `Backend/routes/notificationRoutes.js` - Notification API routes
- `Backend/utils/notificationHelper.js` - Helper functions
- `Frontend/src/components/Admin/AdminNotifications.jsx` - UI component
- `Frontend/src/styles/AdminNotifications.css` - Styling
- `NOTIFICATIONS_GUIDE.md` - Full documentation (this file)

### Modified
- `Backend/server.js` - Added notification routes
- `Frontend/src/pages/AdminDashboard.jsx` - Added notifications tab
- `Frontend/src/components/Admin/AdminSidebar.jsx` - Added notifications menu

## Support

For issues or questions:
1. Check browser console (F12)
2. Check backend logs (terminal)
3. Verify JWT token is valid
4. Ensure admin user exists in database
5. Check database connection is active
