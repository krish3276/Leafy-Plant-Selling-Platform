# 🛠️ Admin API Reference

## Base URL
```
http://localhost:5000/api/admin
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format
All responses follow this format:

```json
{
  "success": true/false,
  "message": "Description of response",
  "data": { /* response data */ }
}
```

---

## Endpoints

### Dashboard

#### Get Dashboard Data
```http
GET /dashboard
```

**Description**: Fetch dashboard overview with statistics

**Response**:
```json
{
  "success": true,
  "dashboard": {
    "stats": {
      "totalProducts": 50,
      "totalUsers": 150,
      "totalAdmins": 2,
      "lowStockCount": 5
    },
    "lowStockProducts": [
      {
        "_id": "...",
        "name": "Plant Name",
        "category": "indoor",
        "stock": 3,
        "price": 25.99
      }
    ],
    "recentProducts": [...]
  }
}
```

---

## Product Management

### Get All Products (Admin View)
```http
GET /products?page=1&limit=10&search=peace&category=indoor&sort=price-low
```

**Query Parameters**:
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `search` - Search by name/description
- `category` - Filter by category (indoor, outdoor, succulents, accessories)
- `sort` - Sort by: price-low, price-high, name, stock-low, createdAt

**Response**:
```json
{
  "success": true,
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Peace Lily",
  "description": "A beautiful, low-maintenance indoor plant",
  "price": 25.99,
  "category": "indoor",
  "stock": 50,
  "difficulty": "easy",
  "sunlight": "low",
  "waterFrequency": "Once a week",
  "size": "Medium",
  "image": "https://...",
  "isActive": true
}
```

**Required Fields**:
- `name` (string, max 100 chars)
- `description` (string, max 2000 chars)
- `price` (number, >= 0)
- `category` (enum: indoor, outdoor, succulents, accessories)
- `stock` (number, >= 0)

**Optional Fields**:
- `difficulty` (enum: easy, medium, hard, default: medium)
- `sunlight` (enum: low, medium, high, default: medium)
- `waterFrequency` (string)
- `size` (string)
- `image` (URL)
- `isActive` (boolean, default: true)

**Response**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "...",
    "name": "Peace Lily",
    "price": 25.99,
    ...
  }
}
```

**Status Codes**:
- `201` - Created successfully
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (not admin)

---

### Update Product
```http
PUT /products/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 29.99,
  "stock": 45,
  ...
}
```

**Parameters**:
- `id` (path) - Product ID

**Response**:
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {...}
}
```

**Status Codes**:
- `200` - Updated successfully
- `400` - Validation error
- `404` - Product not found
- `401` - Unauthorized
- `403` - Forbidden

---

### Delete Product
```http
DELETE /products/:id
```

**Parameters**:
- `id` (path) - Product ID

**Response**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Status Codes**:
- `200` - Deleted successfully
- `404` - Product not found
- `401` - Unauthorized
- `403` - Forbidden

---

## User Management

### Get All Users
```http
GET /users?page=1&limit=10&search=john&role=customer
```

**Query Parameters**:
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `search` - Search by first name, last name, or email
- `role` - Filter by role (admin, customer)

**Response**:
```json
{
  "success": true,
  "users": [
    {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "customer",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

---

### Update User Role
```http
PUT /users/:id/role
Content-Type: application/json

{
  "role": "admin"
}
```

**Parameters**:
- `id` (path) - User ID

**Body**:
- `role` (enum: admin, customer) - New role

**Response**:
```json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {...}
}
```

**Restrictions**:
- Cannot remove the last admin from system
- Admin making changes cannot deactivate themselves

**Status Codes**:
- `200` - Updated successfully
- `400` - Invalid role or last admin error
- `404` - User not found
- `401` - Unauthorized
- `403` - Forbidden

---

### Deactivate User
```http
PUT /users/:id/deactivate
```

**Parameters**:
- `id` (path) - User ID

**Response**:
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "user": {
    "_id": "...",
    "isActive": false,
    ...
  }
}
```

**Restrictions**:
- Admin cannot deactivate own account
- Deactivated users cannot login

**Status Codes**:
- `200` - Deactivated successfully
- `400` - Cannot deactivate own account
- `404` - User not found
- `401` - Unauthorized
- `403` - Forbidden

---

## Statistics

### Get User Statistics
```http
GET /stats/users
```

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "totalAdmins": 2,
    "activeUsers": 145,
    "inactiveUsers": 5,
    "usersPerDay": [
      {
        "_id": "2024-01-15",
        "count": 5
      },
      ...
    ]
  }
}
```

---

### Get Order Statistics
```http
GET /stats/orders
```

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalOrders": 0,
    "pendingOrders": 0,
    "completedOrders": 0,
    "totalRevenue": 0
  }
}
```

> Note: Currently placeholder. Will be implemented with order system.

---

## Error Handling

### Common Error Responses

**400 - Bad Request**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "param": "email",
      "msg": "Invalid email format"
    }
  ]
}
```

**401 - Unauthorized**
```json
{
  "success": false,
  "message": "Not authorized. Please login."
}
```

**403 - Forbidden**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**404 - Not Found**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**500 - Server Error**
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details"
}
```

---

## Example cURL Requests

### Login to Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@leafy.com",
    "password": "your_password"
  }'
```

### Get All Products
```bash
curl -X GET "http://localhost:5000/api/admin/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monstera Deliciosa",
    "description": "Popular indoor plant",
    "price": 45.99,
    "category": "indoor",
    "stock": 30,
    "difficulty": "medium",
    "sunlight": "medium",
    "waterFrequency": "Weekly"
  }'
```

### Update User Role
```bash
curl -X PUT http://localhost:5000/api/admin/users/USER_ID/role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- Limit requests per IP
- Limit requests per user
- Implement request throttling

---

## Pagination

Responses with pagination include:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

Calculate total pages: `ceil(total / limit)`

---

## Sorting Options

Available sort values:
- `price-low` - Lowest price first
- `price-high` - Highest price first
- `name` - Alphabetical order
- `stock-low` - Lowest stock first
- `createdAt` - Newest first (default)

---

## Token Expiration

JWT tokens expire after the duration set in JWT_EXPIRE (default: 7 days)

When token expires:
1. User will get 401 Unauthorized
2. Must login again to get new token
3. New token will be stored automatically

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2024 | Initial release |

---

**Last Updated**: December 2025
