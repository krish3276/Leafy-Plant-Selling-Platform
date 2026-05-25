# 🔐 Admin Dashboard - Debug & Testing Guide

## ✅ Status

- **Backend Server**: Running ✅ (http://localhost:5000)
- **Admin Account**: Created ✅ (admin@leafy.com)
- **Database Connection**: Connected ✅ (MongoDB Atlas)
- **Admin Routes**: Registered ✅

## 🔑 Admin Login Credentials

```
Email:    admin@leafy.com
Password: Admin@123456
Portal:   http://localhost:5173/admin/login
```

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd Backend
node server.js
```

### 2. Start Frontend Server (in another terminal)
```bash
cd Frontend/leafy-frontend
npm run dev
```

### 3. Test Admin Login
- Open: http://localhost:5173/admin/login
- Email: admin@leafy.com
- Password: Admin@123456
- Click Login

## 🔧 Testing the Dashboard Endpoint

If you get a **404 error** on `/api/admin/dashboard`, follow these steps:

### Option 1: Use the API Tester HTML File
1. Open: `admin-api-tester.html` (in the root project folder)
2. Click "🔒 Test Login" button
3. Click "📊 Test Dashboard" button
4. Check the output

### Option 2: Verify Server Logs
In the Backend terminal, you should see:
```
2025-12-19 19:00:00 - GET /api/admin/dashboard
```

### Option 3: Check Routes
The admin routes should be at: `Backend/routes/adminRoutes.js`

Key lines:
```javascript
router.use(protect, adminOnly);  // All routes protected
router.get('/dashboard', getDashboard);  // Dashboard endpoint
```

## ❌ Common Issues & Fixes

### Issue: 404 on /api/admin/dashboard
**Cause**: Server not restarted after adding routes
**Fix**: 
```bash
# Kill all node processes
Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force

# Restart backend
cd Backend
node server.js
```

### Issue: 401 Unauthorized
**Cause**: JWT token not sent or invalid
**Fix**: 
- Make sure token is sent in `Authorization: Bearer <token>` header
- Check that JWT_SECRET in .env matches

### Issue: 403 Forbidden
**Cause**: User is not an admin
**Fix**:
- Check user role in database
- Verify user.role === 'admin'

### Issue: Cannot connect to server
**Cause**: Server not running on port 5000
**Fix**:
```bash
# Check if port 5000 is in use
Get-NetTcpConnection -LocalPort 5000

# If in use, kill the process
Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force
```

## 📋 Verification Checklist

- [ ] Backend server running on http://localhost:5000
- [ ] Frontend server running on http://localhost:5173
- [ ] Admin account created in database (admin@leafy.com)
- [ ] Can login with admin@leafy.com / Admin@123456
- [ ] Admin dashboard loads at /admin/dashboard
- [ ] Dashboard fetches data from /api/admin/dashboard
- [ ] Can see products, users, and stats in dashboard

## 🔍 Database Verification

To verify admin account exists:
```bash
cd Backend
node scripts/debugDatabase.js
```

Should output:
```
📊 Total Admin Users: 1
✅ admin@leafy.com EXISTS in database
   Role: admin
   Active: true
```

## 📚 API Endpoints

All admin endpoints require:
- **Authentication**: JWT token in `Authorization: Bearer <token>` header
- **Role**: admin

Available endpoints:
```
GET    /api/admin/dashboard
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
GET    /api/admin/users
PUT    /api/admin/users/:id/role
PUT    /api/admin/users/:id/deactivate
GET    /api/admin/stats/users
GET    /api/admin/stats/orders
```

## 💡 Next Steps

1. Make sure both servers are running
2. Open http://localhost:5173/admin/login
3. Login with admin@leafy.com / Admin@123456
4. Check if dashboard loads without errors
5. If you see the 404 error, use the API Tester HTML file to diagnose

## 📞 Need Help?

- Check the server logs in your Backend terminal
- Use the API Tester HTML file to test endpoints
- Verify .env file has JWT_SECRET and MONGODB_URI
- Make sure admin account exists using debugDatabase.js script
