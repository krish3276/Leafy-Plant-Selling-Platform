# 🧪 API Testing Guide

## Quick Test Commands (PowerShell)

### 1. Test Server Health
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/" -Method GET
```

### 2. Test Health Endpoint
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
```

### 3. Test Signup (Create Account)
```powershell
$signupBody = @{
    firstName = "Test"
    lastName = "User"
    email = "test@example.com"
    password = "Test123"
    confirmPassword = "Test123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method POST -Body $signupBody -ContentType "application/json"
```

### 4. Test Login
```powershell
$loginBody = @{
    email = "test@example.com"
    password = "Test123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"
```

### 5. Test Get Profile (Protected Route)
```powershell
# First save token from login, then:
$headers = @{
    "Authorization" = "Bearer $token"
}
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method GET -Headers $headers
```

---

## 🎯 Thunder Client Testing (Recommended for VS Code)

### Install Thunder Client:
1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search "Thunder Client"
3. Install it
4. Click Thunder Client icon in sidebar

### Create Requests:

#### Request 1: Signup
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/signup`
- **Body (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Test123",
  "confirmPassword": "Test123"
}
```
- Click **Send**
- **Copy the token** from response

#### Request 2: Login
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "Test123"
}
```

#### Request 3: Get Profile
- **Method:** GET
- **URL:** `http://localhost:5000/api/auth/profile`
- **Headers:**
  - Key: `Authorization`
  - Value: `Bearer YOUR_TOKEN_HERE`
- Click **Send**

---

## 📝 Expected Responses:

### Signup Success:
```json
{
  "success": true,
  "message": "Account created successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "676321ab12cd34ef56789012",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Login Success:
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Get Profile Success:
```json
{
  "success": true,
  "user": {
    "id": "676321ab12cd34ef56789012",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer",
    "cart": [],
    "wishlist": []
  }
}
```

---

## ❌ Common Errors:

### Email Already Exists:
```json
{
  "success": false,
  "message": "Email already registered. Please login instead."
}
```

### Invalid Login:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Unauthorized (No Token):
```json
{
  "success": false,
  "message": "Not authorized. Please login."
}
```

---

Ready to test! Which method do you prefer?
