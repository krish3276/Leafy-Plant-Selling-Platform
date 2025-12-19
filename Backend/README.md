# 🌱 Leafy Backend API

Complete backend server for the Leafy Plant Selling Platform with authentication, user management, and RESTful API.

## 📚 What You'll Learn

This backend teaches you:
- **Node.js & Express**: Building web servers
- **MongoDB & Mongoose**: Database management  
- **JWT Authentication**: Secure user sessions
- **API Design**: RESTful architecture
- **Middleware**: Request processing pipeline
- **Security**: Password hashing, validation, CORS

---

## 🏗️ Project Structure

```
Backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── authController.js    # Auth logic (signup, login)
├── middleware/
│   ├── auth.js             # JWT verification
│   └── validation.js       # Input validation rules
├── models/
│   └── User.js             # User schema
├── routes/
│   └── authRoutes.js       # API endpoints
├── .env                    # Environment variables
├── package.json            # Dependencies
└── server.js              # Main server file
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Setup Environment Variables
The `.env` file is already configured with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leafy
JWT_SECRET=leafy_secret_key_2025
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5174
NODE_ENV=development
```

### 3. Install & Start MongoDB
**Option A: Local MongoDB**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Install and start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create cluster and get connection string
- Update `MONGODB_URI` in `.env`

### 4. Start the Server
```bash
npm start        # Production
npm run dev      # Development (auto-restart)
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes

#### 1. **Signup** - Create new account
```http
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### 2. **Login** - Authenticate user
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### 3. **Get Profile** - Get current user (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

#### 4. **Update Profile** - Update account (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

---

## 🔐 Authentication Flow

### How JWT Works:

1. **User Signs Up/Logs In**
   - Backend verifies credentials
   - Generates JWT token with user ID
   - Sends token to frontend

2. **Frontend Stores Token**
   ```javascript
   localStorage.setItem('token', token);
   ```

3. **Making Authenticated Requests**
   ```javascript
   fetch('http://localhost:5000/api/auth/profile', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   })
   ```

4. **Backend Verifies Token**
   - Extracts token from header
   - Verifies signature
   - Extracts user ID
   - Finds user in database
   - Continues to controller

---

## 🧪 Testing the API

### Using Thunder Client / Postman:

1. **Test Signup:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/signup`
   - Body (JSON):
   ```json
   {
     "firstName": "Test",
     "lastName": "User",
     "email": "test@example.com",
     "password": "Test123",
     "confirmPassword": "Test123"
   }
   ```
   - Copy the `token` from response

2. **Test Login:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body: email + password

3. **Test Get Profile:**
   - Method: GET
   - URL: `http://localhost:5000/api/auth/profile`
   - Headers: `Authorization: Bearer <paste-token-here>`

---

## 🎓 Learning Guide

### Key Concepts Explained:

#### 1. **Express.js**
- Web framework for Node.js
- Simplifies routing and middleware
- Handles HTTP requests/responses

#### 2. **Middleware**
- Functions that run before controllers
- Process requests in a pipeline
- Examples: authentication, validation, logging

#### 3. **Controllers**
- Business logic for routes
- Interact with database
- Send responses

#### 4. **Models (Mongoose)**
- Define data structure
- Provide database operations
- Validate data

#### 5. **JWT (JSON Web Tokens)**
- Secure authentication method
- Stateless (server doesn't store sessions)
- Contains user info in encrypted format

#### 6. **Password Hashing**
- Never store plain text passwords
- bcrypt one-way encrypts passwords
- Compare hashed values during login

#### 7. **Async/Await**
- Handle asynchronous operations
- Wait for database queries
- Cleaner than callbacks

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Error: connect ECONNREFUSED
```
**Solution:** Start MongoDB service or check connection string

### Port Already in Use
```
❌ Error: listen EADDRINUSE: address already in use
```
**Solution:** 
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <process-id> /F

# Or change PORT in .env
```

### JWT Token Invalid
```
❌ Invalid token. Please login again.
```
**Solution:** Token expired or wrong secret. Login again to get new token.

---

## 📦 Dependencies Explained

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT creation/verification
- **dotenv**: Environment variables
- **cors**: Enable cross-origin requests
- **express-validator**: Input validation
- **nodemon** (dev): Auto-restart server

---

## 🔜 Next Steps

1. ✅ **Connect Frontend**
   - Update API URLs in frontend
   - Test login/signup from UI

2. 📦 **Add Product Management**
   - Create Product model
   - Build CRUD controllers
   - Add product routes

3. 🛒 **Shopping Cart**
   - Cart operations
   - Add/remove items
   - Checkout process

4. 🤖 **AI Integration**
   - Plant care chatbot
   - Image analysis

5. 📊 **Admin Dashboard**
   - Manage products
   - View orders
   - User management

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB University](https://university.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

Made with 🌱 by Krish Sirsath
