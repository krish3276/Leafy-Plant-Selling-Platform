# 🌱 Leafy API Endpoints Guide

Complete reference for all available API endpoints with examples for testing in Thunder Client or Postman.

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. User Signup
**POST** `/auth/signup`

**Body (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6944ee06aa4c293d08494d60",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 2. User Login
**POST** `/auth/login`

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6944ee06aa4c293d08494d60",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 3. Get User Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "6944ee06aa4c293d08494d60",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "cart": [],
    "wishlist": []
  }
}
```

---

### 4. Update User Profile
**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (JSON):**
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "6944ee06aa4c293d08494d60",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 🌿 Product Endpoints

### 5. Get All Products (with filters)
**GET** `/products`

**Query Parameters (all optional):**
- `category` - Filter by category (indoor, outdoor, succulents, accessories)
- `search` - Search in name/description
- `minPrice` - Minimum price in cents (e.g., 1000 = ₹10.00)
- `maxPrice` - Maximum price in cents
- `difficulty` - Filter by difficulty (easy, medium, hard)
- `sort` - Sort by: price, -price, rating, -rating, name

**Examples:**
```
GET /products
GET /products?category=succulents
GET /products?minPrice=1000&maxPrice=3000
GET /products?search=monstera
GET /products?difficulty=easy&sort=price
GET /products?category=indoor&sort=-rating
```

**Response (200):**
```json
{
  "success": true,
  "count": 12,
  "products": [
    {
      "_id": "694502...",
      "name": "Monstera Deliciosa",
      "description": "The Swiss Cheese Plant...",
      "price": 2999,
      "category": "indoor",
      "image": "https://images.unsplash.com/...",
      "stock": 25,
      "difficulty": "easy",
      "sunlight": "medium",
      "waterFrequency": "Weekly",
      "size": "medium",
      "features": ["Air Purifying", "Pet-Friendly Warning"],
      "rating": 0,
      "reviews": []
    }
  ]
}
```

---

### 6. Get Product by ID
**GET** `/products/:id`

**Example:**
```
GET /products/694502a5b1c2d3e4f5a6b7c8
```

**Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "694502...",
    "name": "Monstera Deliciosa",
    "description": "The Swiss Cheese Plant...",
    "price": 2999,
    "category": "indoor",
    "image": "https://images.unsplash.com/...",
    "stock": 25,
    "difficulty": "easy",
    "sunlight": "medium",
    "waterFrequency": "Weekly",
    "size": "medium",
    "features": ["Air Purifying"],
    "rating": 4.5,
    "reviews": [
      {
        "user": "6944ee06...",
        "name": "John Doe",
        "rating": 5,
        "comment": "Beautiful plant!",
        "createdAt": "2025-12-19T06:30:00.000Z"
      }
    ]
  }
}
```

---

### 7. Create Product (Admin Only)
**POST** `/products`

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Body (JSON):**
```json
{
  "name": "Spider Plant",
  "description": "Easy-to-care trailing plant",
  "price": 1299,
  "category": "indoor",
  "image": "https://example.com/spider-plant.jpg",
  "stock": 30,
  "difficulty": "easy",
  "sunlight": "medium",
  "waterFrequency": "Weekly",
  "size": "small",
  "features": ["Air Purifying", "Pet Safe"]
}
```

**Response (201):**
```json
{
  "success": true,
  "product": { ... }
}
```

---

### 8. Update Product (Admin Only)
**PUT** `/products/:id`

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Body (JSON):**
```json
{
  "price": 1499,
  "stock": 40
}
```

**Response (200):**
```json
{
  "success": true,
  "product": { ... }
}
```

---

### 9. Delete Product (Admin Only)
**DELETE** `/products/:id`

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 10. Add Product Review
**POST** `/products/:id/reviews`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (JSON):**
```json
{
  "rating": 5,
  "comment": "Amazing plant! Arrived in perfect condition."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Review added successfully",
  "product": {
    "rating": 4.8,
    "reviews": [ ... ]
  }
}
```

---

## 🛒 Cart Endpoints

### 11. Get User Cart
**GET** `/cart`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "cart": [
    {
      "product": {
        "_id": "694502...",
        "name": "Monstera Deliciosa",
        "price": 2999,
        "image": "https://...",
        "stock": 25
      },
      "quantity": 2,
      "_id": "694503..."
    }
  ],
  "totalItems": 2,
  "totalPrice": 5998
}
```

---

### 12. Add Product to Cart
**POST** `/cart/add`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (JSON):**
```json
{
  "productId": "694502a5b1c2d3e4f5a6b7c8",
  "quantity": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "cart": [ ... ]
}
```

---

### 13. Update Cart Item Quantity
**PUT** `/cart/update`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (JSON):**
```json
{
  "productId": "694502a5b1c2d3e4f5a6b7c8",
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "cart": [ ... ]
}
```

---

### 14. Remove Product from Cart
**DELETE** `/cart/remove/:productId`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example:**
```
DELETE /cart/remove/694502a5b1c2d3e4f5a6b7c8
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product removed from cart",
  "cart": [ ... ]
}
```

---

### 15. Clear Cart
**DELETE** `/cart/clear`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "cart": []
}
```

---

## 📝 Testing Workflow Example

### Step 1: Create Account
```http
POST /auth/signup
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@leafy.com",
  "password": "Test1234",
  "confirmPassword": "Test1234"
}
```
**Save the token from response!**

---

### Step 2: Browse Products
```http
GET /products?category=indoor&sort=price
```

---

### Step 3: Add to Cart
```http
POST /cart/add
Authorization: Bearer YOUR_TOKEN
{
  "productId": "PRODUCT_ID_FROM_STEP_2",
  "quantity": 1
}
```

---

### Step 4: View Cart
```http
GET /cart
Authorization: Bearer YOUR_TOKEN
```

---

### Step 5: Add Review
```http
POST /products/PRODUCT_ID/reviews
Authorization: Bearer YOUR_TOKEN
{
  "rating": 5,
  "comment": "Great plant!"
}
```

---

## 🚨 Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details..."
}
```

---

## 🔧 Testing Tips

1. **Use Thunder Client Extension:**
   - Install from VS Code Extensions
   - Create a new collection for Leafy API
   - Save your JWT token in environment variables

2. **Save Your Token:**
   - After login/signup, copy the token
   - Set it as Bearer token in Authorization header
   - Token expires in 7 days

3. **Test in Order:**
   - First signup/login
   - Then test protected routes with token
   - Test cart operations
   - Finally test reviews

4. **Check Stock:**
   - View products to get current stock
   - Can't add more to cart than available stock

5. **Admin Testing:**
   - Manually change user role in MongoDB to "admin"
   - Then test create/update/delete product endpoints

---

## 📊 Current Seeded Products

The database has 12 products ready for testing:
1. Monstera Deliciosa - ₹29.99 (indoor)
2. Snake Plant - ₹14.99 (indoor)
3. Fiddle Leaf Fig - ₹49.99 (indoor)
4. Pothos Golden - ₹8.99 (indoor)
5. Succulent Collection - ₹12.99 (succulents)
6. Peace Lily - ₹18.99 (indoor)
7. Aloe Vera - ₹7.99 (succulents)
8. ZZ Plant - ₹24.99 (indoor)
9. Boston Fern - ₹16.99 (outdoor)
10. Rubber Plant - ₹34.99 (indoor)
11. String of Pearls - ₹13.99 (succulents)
12. Bird of Paradise - ₹59.99 (indoor)

---

Happy Testing! 🌱
