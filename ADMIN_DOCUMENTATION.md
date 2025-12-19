# 🔐 Admin Portal Documentation

## Overview

The Leafy Plant Selling Platform includes a comprehensive admin dashboard for managing products, users, and business operations. The admin section is secured with role-based authentication.

## Features

### 1. **Secure Admin Login**
- Email and password authentication
- Role-based access control (admin only)
- JWT token-based security
- Session management with localStorage

### 2. **Dashboard Overview**
- Key statistics (total products, users, admins)
- Low stock product alerts
- Recent product additions
- Quick overview of business metrics

### 3. **Product Management**
- **View**: List all products with filters and search
- **Create**: Add new plant products with detailed information
- **Update**: Edit existing product details
- **Delete**: Remove products from inventory
- **Features**:
  - Search and filter by category
  - Stock level indicators
  - Product status (active/inactive)
  - Pagination support
  - Bulk operations ready

### 4. **User Management**
- **View**: List all users and admins
- **Filter**: By role and activity status
- **Search**: Find users by name or email
- **Role Management**: Toggle between admin and customer roles
- **Deactivation**: Disable user accounts
- **Features**:
  - User statistics
  - Account status tracking
  - Role assignment

### 5. **Admin Features**
- Real-time data updates
- Responsive design
- Secure operations with token verification
- Comprehensive error handling

## Technology Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

## Getting Started

### Access Admin Portal

1. **Navigate to Admin Login**:
   ```
   http://localhost:5173/admin/login
   ```

2. **Login Credentials** (Initial Setup):
   ```
   Email: admin@leafy.com
   Password: [check your database/backend setup]
   ```

3. **Access Dashboard**:
   ```
   http://localhost:5173/admin/dashboard
   ```

## API Endpoints

### Admin Routes
All routes require authentication and admin role. Base URL: `http://localhost:5000/api/admin`

```
GET    /dashboard          - Get dashboard data
GET    /products           - Get all products (with pagination)
POST   /products           - Create new product
PUT    /products/:id       - Update product
DELETE /products/:id       - Delete product
GET    /users              - Get all users
PUT    /users/:id/role     - Update user role
PUT    /users/:id/deactivate - Deactivate user
GET    /stats/users        - Get user statistics
GET    /stats/orders       - Get order statistics
```

### Request Headers
```javascript
{
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

## File Structure

```
Frontend/
├── src/
│   ├── pages/
│   │   ├── AdminLogin.jsx        # Admin login page
│   │   └── AdminDashboard.jsx    # Main dashboard
│   ├── components/
│   │   └── Admin/
│   │       ├── AdminSidebar.jsx      # Navigation sidebar
│   │       ├── AdminStats.jsx        # Dashboard statistics
│   │       ├── ProductManagement.jsx # Product CRUD
│   │       ├── ProductForm.jsx       # Product form modal
│   │       └── UserManagement.jsx    # User management
│   └── styles/
│       ├── AdminLogin.css
│       └── AdminDashboard.css

Backend/
├── routes/
│   └── adminRoutes.js            # Admin route definitions
├── controllers/
│   └── adminController.js        # Admin business logic
└── middleware/
    └── auth.js                   # Authentication & authorization
```

## Security Features

### 1. **Authentication**
- JWT token validation on every request
- Token stored securely in localStorage
- Automatic logout on invalid/expired token

### 2. **Authorization**
- Role-based access control (adminOnly middleware)
- User must have 'admin' role to access admin panel
- Cannot modify own admin status (safety feature)

### 3. **Data Protection**
- Passwords hashed with bcryptjs
- Sensitive data not exposed in responses
- Input validation on all requests
- CORS enabled for authorized origins

### 4. **Admin Protections**
- Cannot deactivate own account
- Cannot remove last admin from system
- All actions are logged (ready for implementation)
- Session-based access control

## Usage Examples

### Create Product (Admin)

```javascript
const createProduct = async () => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:5000/api/admin/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Peace Lily',
      description: 'A beautiful indoor plant...',
      price: 25.99,
      category: 'indoor',
      stock: 50,
      difficulty: 'easy',
      sunlight: 'low',
      waterFrequency: 'Once a week',
      image: 'https://...',
      isActive: true,
    }),
  });
  
  const data = await response.json();
  console.log(data);
};
```

### Update User Role (Admin)

```javascript
const updateUserRole = async (userId, newRole) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(
    `http://localhost:5000/api/admin/users/${userId}/role`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    }
  );
  
  const data = await response.json();
  return data;
};
```

## Dashboard Components

### 1. **Admin Sidebar**
- Navigation menu
- Active tab indicator
- Collapse/expand on mobile
- User profile section
- Quick logout button

### 2. **Statistics Cards**
- Total products count
- Total customers count
- Total admins count
- Low stock items alert

### 3. **Low Stock Alert**
- Products with stock < 10
- Sortable and filterable
- Quick edit access

### 4. **Product Management Table**
- Searchable and filterable
- Sortable by name, price, stock
- Inline edit and delete actions
- Pagination support
- Status indicators

### 5. **User Management Table**
- User information display
- Role badges
- Status indicators
- Bulk role assignment
- User deactivation

## Error Handling

The admin panel includes comprehensive error handling:

```javascript
// Authentication Errors
401 - Unauthorized (invalid/missing token)
403 - Forbidden (user is not admin)

// Business Logic Errors
400 - Bad Request (validation failures)
404 - Not Found (resource doesn't exist)
409 - Conflict (duplicate entries, etc.)

// Server Errors
500 - Internal Server Error
```

## Best Practices

### For Admins:
1. ✅ Use strong, unique passwords
2. ✅ Logout when done with admin tasks
3. ✅ Verify information before deleting
4. ✅ Keep product details updated
5. ✅ Monitor low stock alerts

### For Developers:
1. ✅ Always verify user role before operations
2. ✅ Validate input data on backend
3. ✅ Use HTTPS in production
4. ✅ Implement rate limiting
5. ✅ Log all admin actions

## Troubleshooting

### Issue: Cannot Login to Admin

**Solution**:
1. Verify user role is 'admin' in database
2. Check if authToken is being saved properly
3. Verify backend server is running
4. Check network tab for API errors

### Issue: Products Not Loading

**Solution**:
1. Verify JWT token is still valid
2. Check backend API is responding
3. Check browser console for errors
4. Verify CORS settings

### Issue: Changes Not Saving

**Solution**:
1. Check for validation errors in form
2. Verify you have admin privileges
3. Check network connection
4. Try refreshing the dashboard

## Future Enhancements

Potential features for future versions:
- 📊 Advanced analytics and reporting
- 📧 Email notifications for low stock
- 💳 Order management system
- 💬 Customer support/messaging
- 📱 Mobile admin app
- 🔍 Advanced search filters
- 📅 Scheduled promotions
- 📈 Sales trends and insights
- 🎯 Inventory forecasting
- 🔄 Bulk import/export

## Support

For issues or questions:
1. Check this documentation
2. Review error messages carefully
3. Check browser console for errors
4. Contact development team

---

**Version**: 1.0.0
**Last Updated**: December 2025
**Status**: ✅ Production Ready
