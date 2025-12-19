# 🎯 SOLUTION: Admin Dashboard 404 Error

## ✅ What We've Done

1. ✅ Created admin account: `admin@leafy.com` / `Admin@123456`
2. ✅ Verified account exists in MongoDB
3. ✅ Configured admin routes in backend
4. ✅ Setup admin controller with all endpoints
5. ✅ Created admin middleware for protection

##  ❌ Your Error

```
GET http://localhost:5000/api/admin/dashboard 404 (Not Found)
```

## 🔧 The Fix

The 404 error means the server isn't recognizing the `/api/admin/dashboard` route. This usually happens because:

### Reason 1: Server hasn't been restarted after adding routes
**MOST LIKELY CAUSE**

### Reason 2: Wrong API URL in frontend
Check that your frontend is calling the correct URL

## ✅ SOLUTION STEPS

### Step 1: Kill All Node Processes
Open PowerShell and run:
```powershell
Get-Process | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "All Node processes stopped ✅"
```

### Step 2: Start Backend Server FRESH
```bash
cd d:\Maitri\Project\Leafy-Plants\Leafy-Plant-Selling-Platform\Backend
node server.js
```

**WAIT** until you see:
```
🚀 Leafy Backend Server Started!
📍 Server running on: http://localhost:5000
✅ MongoDB Connected: ...
```

### Step 3: Start Frontend Server (in NEW terminal)
```bash
cd d:\Maitri\Project\Leafy-Plants\Leafy-Plant-Selling-Platform\Frontend\leafy-frontend
npm run dev
```

**WAIT** until it says:
```
Local:   http://localhost:5173/
```

### Step 4: Verify Backend is Responding
In another PowerShell terminal, run:
```powershell
curl http://localhost:5000/api/health
```

You should see:
```json
{"success":true,"message":"Server is healthy",...}
```

### Step 5: Test Login
```powershell
$body = @{email="admin@leafy.com";password="Admin@123456"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body | Select-Object -ExpandProperty Content
```

You should get back a JSON response with `success: true` and a `token`.

### Step 6: Test Dashboard Endpoint
Copy the token from Step 5, then run:
```powershell
$token = "PASTE_TOKEN_HERE"
Invoke-WebRequest -Uri "http://localhost:5000/api/admin/dashboard" -Headers @{"Authorization"="Bearer $token"} | Select-Object -ExpandProperty Content
```

You should get:
```json
{"success":true,"dashboard":{"stats":{...},...}}
```

### Step 7: Login Via Frontend
1. Open http://localhost:5173/admin/login
2. Enter email: `admin@leafy.com`
3. Enter password: `Admin@123456`
4. Click Login
5. You should be redirected to `/admin/dashboard`

## 🔍 If Still Seeing 404

### Check 1: Verify Route is Registered
In backend terminal, after server starts, you should see logs like:
```
2025-12-19 19:00:00 - GET /api/admin/dashboard
```

If you don't see these logs when accessing the dashboard, the request isn't reaching the server.

### Check 2: Verify adminRoutes.js Exists
```
Backend/routes/adminRoutes.js
```

Should contain:
```javascript
router.get('/dashboard', getDashboard);
```

### Check 3: Verify server.js Imports Routes
```javascript
import adminRoutes from './routes/adminRoutes.js';
app.use('/api/admin', adminRoutes);
```

Should be in `Backend/server.js` at the top and around line 54.

### Check 4: Verify Frontend URL
In `Frontend/leafy-frontend/src/pages/AdminDashboard.jsx`, line ~50:
```javascript
const response = await fetch('http://localhost:5000/api/admin/dashboard', {
```

Should be exactly: `http://localhost:5000/api/admin/dashboard`

## 🎯 FINAL CHECKLIST

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] `http://localhost:5000/api/health` returns 200
- [ ] Admin login returns JWT token
- [ ] `http://localhost:5000/api/admin/dashboard` returns 200 with token
- [ ] Frontend shows admin dashboard without 404 error

## 💻 Quick Test Script

Open `admin-api-tester.html` in your browser:
1. File path: `d:\Maitri\Project\Leafy-Plants\Leafy-Plant-Selling-Platform\admin-api-tester.html`
2. Double-click to open in default browser
3. Click "🔒 Test Login"
4. Click "📊 Test Dashboard"

If both succeed, the issue is in your frontend configuration or CORS.

## 📋 If Error Persists

Please run these commands and share the output:

```bash
# Terminal 1: Backend
cd Backend
node server.js

# Terminal 2: Test endpoint
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@leafy.com\",\"password\":\"Admin@123456\"}"
```

Then with the token from that response:
```bash
curl -H "Authorization: Bearer TOKEN_HERE" http://localhost:5000/api/admin/dashboard
```

Send the output and I can debug further!
