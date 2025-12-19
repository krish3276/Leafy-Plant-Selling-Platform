# 🚀 Admin Section Setup Guide

## Quick Start

### 1. Backend Setup

The admin routes have been automatically added to the backend. Ensure your backend server is running:

```bash
cd Backend
npm install  # If not already done
npm start    # Start the server
```

**Backend should be running on**: `http://localhost:5000`

### 2. Frontend Setup

The admin pages and components are ready. Start your frontend:

```bash
cd Frontend/leafy-frontend
npm install  # If not already done
npm run dev  # Start development server
```

**Frontend should be running on**: `http://localhost:5173`

### 3. Create First Admin User

You have two options:

#### Option A: Via MongoDB (Recommended for First Setup)

1. Open MongoDB Atlas or MongoDB Compass
2. Find the `users` collection
3. Create a new document with:

```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@leafy.com",
  "password": "$2a$10$...", // bcrypt hashed password
  "role": "admin",
  "isActive": true,
  "cart": [],
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

To generate bcrypt hash, use a bcrypt tool or Node.js:
```javascript
const bcrypt = require('bcryptjs');
const password = 'securePassword123';
const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);
```

#### Option B: Via Signup + Database Update

1. Sign up as normal user: `http://localhost:5173/signup`
2. Open MongoDB and update that user's `role` field to `"admin"`

### 4. Access Admin Panel

1. Navigate to: `http://localhost:5173/admin/login`
2. Login with credentials:
   - **Email**: `admin@leafy.com`
   - **Password**: (the password you set)
3. You should be redirected to dashboard automatically

## Admin Features Overview

### Dashboard
- View key statistics
- Monitor low stock alerts
- See recent products added
- Quick overview of your business

### Product Management
- ➕ **Add Products**: Click "Add Product" button
- 📝 **Edit Products**: Click pencil icon
- 🗑️ **Delete Products**: Click trash icon
- 🔍 **Search & Filter**: Use search bar at the top
- 📊 **View Stock Levels**: Color-coded stock badges

### User Management
- 👥 **View All Users**: See all registered customers
- 👨‍💼 **Promote Users**: Convert customer to admin
- 🚫 **Deactivate Users**: Disable accounts
- 🔍 **Search Users**: Find by name or email
- 📊 **Filter by Role**: View admins or customers

## Default Admin Credentials

If you used the setup script, use these:
```
Email: admin@leafy.com
Password: Admin123!@# (or password you set)
```

⚠️ **IMPORTANT**: Change these credentials in production!

## Environment Variables

Ensure your `.env` file in Backend has:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## Troubleshooting

### "Cannot Login" Error

1. **Check if admin account exists**:
   - Use MongoDB Compass to verify
   - User should have `role: "admin"`

2. **Verify backend is running**:
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Check browser console** (F12) for API errors

4. **Clear localStorage**:
   ```javascript
   localStorage.clear();
   ```

### "Unauthorized" Error

1. Token might be expired - try logging out and logging back in
2. User role might have changed - verify in database
3. Check JWT_SECRET matches between frontend and backend

### Products Not Loading

1. Verify backend is running
2. Check API endpoint: `http://localhost:5000/api/admin/products`
3. Check network tab in DevTools (F12)

## Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS
- [ ] Set appropriate CORS origins
- [ ] Enable database authentication
- [ ] Set up database backups
- [ ] Enable API rate limiting
- [ ] Set up monitoring/logging
- [ ] Review security headers

## Next Steps

1. ✅ Login to admin panel
2. ✅ Add sample products
3. ✅ Test product editing
4. ✅ Test user management
5. ✅ Create backup admin account
6. ✅ Set up proper logging

## API Base URL

Make sure this matches in your environment:
```
http://localhost:5000/api
```

If you're deploying to production, update this URL in:
- `Frontend/.env` (create if doesn't exist)
- All API calls in components

## Support

- Check [ADMIN_DOCUMENTATION.md](./ADMIN_DOCUMENTATION.md) for detailed docs
- Review error messages in browser console
- Check backend logs for API errors

---

**Ready to start?** 🚀 Go to: `http://localhost:5173/admin/login`
