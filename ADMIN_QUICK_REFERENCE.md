# 🚀 Admin Section Quick Reference

## 📍 Quick Links

| Component | File Path | Purpose |
|-----------|-----------|---------|
| Admin Login | `src/pages/AdminLogin.jsx` | Secure admin authentication |
| Dashboard | `src/pages/AdminDashboard.jsx` | Main admin interface |
| Products Tab | `src/components/Admin/ProductManagement.jsx` | CRUD operations |
| Users Tab | `src/components/Admin/UserManagement.jsx` | User management |
| Sidebar | `src/components/Admin/AdminSidebar.jsx` | Navigation menu |

---

## 🔐 Credentials

```
Email: admin@leafy.com
Password: [Set during setup]

⚠️ CHANGE IN PRODUCTION!
```

---

## 🌐 URLs

| Page | URL |
|------|-----|
| Admin Login | `http://localhost:5173/admin/login` |
| Dashboard | `http://localhost:5173/admin/dashboard` |
| Backend API | `http://localhost:5000/api/admin` |

---

## 📋 File Checklist

### Backend Files Created
- ✅ `Backend/routes/adminRoutes.js`
- ✅ `Backend/controllers/adminController.js`
- ✅ `Backend/server.js` (updated)

### Frontend Pages Created
- ✅ `src/pages/AdminLogin.jsx`
- ✅ `src/pages/AdminDashboard.jsx`
- ✅ `src/App.jsx` (updated)

### Frontend Components Created
- ✅ `src/components/Admin/AdminSidebar.jsx`
- ✅ `src/components/Admin/AdminStats.jsx`
- ✅ `src/components/Admin/ProductManagement.jsx`
- ✅ `src/components/Admin/ProductForm.jsx`
- ✅ `src/components/Admin/UserManagement.jsx`

### CSS Files Created
- ✅ `src/styles/AdminLogin.css`
- ✅ `src/styles/AdminDashboard.css`
- ✅ `src/components/Admin/AdminSidebar.css`
- ✅ `src/components/Admin/AdminStats.css`
- ✅ `src/components/Admin/ProductManagement.css`
- ✅ `src/components/Admin/ProductForm.css`
- ✅ `src/components/Admin/UserManagement.css`

### Documentation Files Created
- ✅ `ADMIN_SETUP.md`
- ✅ `ADMIN_DOCUMENTATION.md`
- ✅ `ADMIN_API_REFERENCE.md`
- ✅ `ADMIN_IMPLEMENTATION_SUMMARY.md`
- ✅ `ADMIN_VISUAL_OVERVIEW.md`

---

## 🚀 Getting Started

### 1. Start Backend
```bash
cd Backend
npm start
```

### 2. Start Frontend
```bash
cd Frontend/leafy-frontend
npm run dev
```

### 3. Create Admin User
See `ADMIN_SETUP.md` for detailed instructions

### 4. Login
Navigate to: `http://localhost:5173/admin/login`

---

## 📊 Dashboard Features

| Feature | Location | Action |
|---------|----------|--------|
| View Stats | Dashboard Tab | See at a glance |
| Low Stock Alert | Dashboard Tab | Check stock levels |
| Add Product | Products Tab | Click "Add Product" |
| Edit Product | Products Tab | Click pencil icon |
| Delete Product | Products Tab | Click trash icon |
| Search Products | Products Tab | Use search bar |
| View Users | Users Tab | Scroll through list |
| Promote User | Users Tab | Click "Make Admin" |
| Deactivate User | Users Tab | Click trash icon |
| Filter Users | Users Tab | Use role dropdown |

---

## 🔑 API Endpoints Quick Reference

### Dashboard
```
GET /api/admin/dashboard
```

### Products
```
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
```

### Users
```
GET /api/admin/users
PUT /api/admin/users/:id/role
PUT /api/admin/users/:id/deactivate
```

### Statistics
```
GET /api/admin/stats/users
GET /api/admin/stats/orders
```

---

## 📝 Request Template

```javascript
// All requests need JWT token
const token = localStorage.getItem('authToken');

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

---

## ❌ Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Invalid token | Logout and login again |
| 403 Forbidden | Not admin | User role must be 'admin' |
| 404 Not Found | Resource missing | Product/User might be deleted |
| 400 Bad Request | Invalid input | Check field types and values |
| Cannot login | Admin doesn't exist | Create admin user in DB |
| Products not loading | Backend down | Check if backend is running |

---

## 🎯 Key Permissions

✅ **Admin Can Do:**
- View all products (active & inactive)
- Create new products
- Edit products
- Delete products
- View all users
- Change user roles
- Deactivate users
- View statistics

❌ **Admin Cannot Do:**
- Deactivate own account
- Remove last admin from system
- Modify their own password (currently)
- Delete system data

---

## 💾 Database Collections

```javascript
// Users Collection
db.users.findOne({ role: 'admin' })

// Products Collection
db.products.find({ isActive: true })

// Check Low Stock
db.products.find({ stock: { $lt: 10 } })
```

---

## 🔄 Authentication Flow Summary

```
1. User enters email & password
   ↓
2. Backend validates credentials
   ↓
3. Check if role === 'admin'
   ↓
4. Generate JWT token
   ↓
5. Store token in localStorage
   ↓
6. Redirect to dashboard
   ↓
7. All API calls include token
   ↓
8. Token verified on every request
```

---

## 📱 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Desktop | >1200px | Full sidebar + content |
| Tablet | 768-1200px | Collapsible sidebar |
| Mobile | <768px | Hidden sidebar (toggle) |

---

## 🎨 Color Reference

```css
/* Primary Colors */
--primary: #2d5f3f;      /* Dark Green */
--secondary: #1a3a26;    /* Darker Green */
--accent: #a8d5ba;       /* Light Green */
--background: #fafaf8;   /* Off-white */

/* Status Colors */
--success: #16a34a;      /* Green */
--warning: #f59e0b;      /* Orange */
--error: #ef4444;        /* Red */
--info: #3b82f6;         /* Blue */
```

---

## 🔍 Debugging Tips

1. **Check Token**: `localStorage.getItem('authToken')`
2. **Check User**: `localStorage.getItem('user')`
3. **Check Console**: Press F12 for DevTools
4. **Check Network**: See API requests in Network tab
5. **Check Backend Logs**: Monitor server console
6. **Clear Cache**: Do hard refresh (Ctrl+Shift+R)

---

## 📚 Documentation Map

| Document | Content |
|----------|---------|
| `ADMIN_SETUP.md` | 🚀 Initial setup guide |
| `ADMIN_DOCUMENTATION.md` | 📖 Feature documentation |
| `ADMIN_API_REFERENCE.md` | 🔌 API endpoints & examples |
| `ADMIN_IMPLEMENTATION_SUMMARY.md` | ✅ What was created |
| `ADMIN_VISUAL_OVERVIEW.md` | 🎨 Architecture & diagrams |

---

## ⚡ Performance Tips

1. **Search Debouncing** - Results load as you type
2. **Pagination** - Products load 10 at a time
3. **Lazy Images** - Load on demand
4. **CSS Optimization** - Minimal file size
5. **Token Caching** - Avoid re-fetching

---

## 🛡️ Security Reminders

✅ Always use HTTPS in production
✅ Set strong JWT_SECRET
✅ Change default admin password
✅ Use environment variables for secrets
✅ Enable CORS only for authorized origins
✅ Keep tokens in secure storage
✅ Validate input on backend
✅ Log all admin actions

---

## 📞 Support Resources

| Issue | Document |
|-------|-----------|
| Setup problems | `ADMIN_SETUP.md` |
| Feature questions | `ADMIN_DOCUMENTATION.md` |
| API issues | `ADMIN_API_REFERENCE.md` |
| Architecture questions | `ADMIN_VISUAL_OVERVIEW.md` |
| Overview | `ADMIN_IMPLEMENTATION_SUMMARY.md` |

---

## 🎯 Next Steps

- [ ] Create admin database user
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Login to admin panel
- [ ] Add test products
- [ ] Test all features
- [ ] Review security
- [ ] Plan production deployment

---

## 📞 Troubleshooting Quick Links

**Backend Issues?**
```bash
# Check if running
curl http://localhost:5000/api/health

# Check logs
npm start
```

**Frontend Issues?**
```bash
# Open DevTools
F12

# Check Network tab
See API calls

# Check Console
See errors
```

**Database Issues?**
```bash
# Check if admin exists
db.users.findOne({ role: 'admin' })

# Verify connection
Check MongoDB status
```

---

## 🎉 You're All Set!

Admin section is ready to use. Visit:
```
http://localhost:5173/admin/login
```

**Enjoy managing your Leafy Plant store!** 🌱

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: December 2025
