import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateProfile,
  addToWishlist,
  googleAuth,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  signupValidation,
  loginValidation,
  updateProfileValidation,
} from '../middleware/validation.js';

const router = express.Router();

router.post('/signup', signupValidation, signup);

/**
 * 🔐 ROUTE: POST /api/auth/login
 * 
 * PURPOSE: Login existing user
 * ACCESS: Public
 * 
 * FLOW:
 * 1. Request: POST /api/auth/login
 * 2. loginValidation: check email and password format
 * 3. login controller: verify credentials and generate token
 * 
 * FRONTEND SENDS:
 * {
 *   "email": "john@example.com",
 *   "password": "Password123"
 * }
 */
router.post('/login', loginValidation, login);

/**
 * 👤 ROUTE: GET /api/auth/profile
 * 
 * PURPOSE: Get current user's profile
 * ACCESS: Private (requires authentication)
 * 
 * FLOW:
 * 1. Request: GET /api/auth/profile
 *    Header: Authorization: Bearer <token>
 * 2. protect middleware:
 *    - Extracts and verifies JWT token
 *    - Finds user by ID from token
 *    - Attaches user to req.user
 *    - If token invalid, stops here with 401 error
 * 3. If authenticated, getProfile controller runs:
 *    - Returns user data from req.user
 * 
 * FRONTEND SENDS:
 * - No body needed
 * - Just Authorization header with token
 * 
 * BACKEND RESPONDS:
 * {
 *   "success": true,
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "email": "john@example.com",
 *     "role": "customer",
 *     "cart": [],
 *     "wishlist": []
 *   }
 * }
 */
router.get('/profile', protect, getProfile);
router.post('/wishlist/:productId', protect, addToWishlist);

/**
 * 🔄 ROUTE: PUT /api/auth/profile
 * 
 * PURPOSE: Update current user's profile
 * ACCESS: Private
 * 
 * FLOW:
 * 1. Request: PUT /api/auth/profile
 * 2. protect: verify authentication
 * 3. updateProfileValidation: validate new data
 * 4. updateProfile: update user in database
 * 
 * FRONTEND SENDS:
 * {
 *   "firstName": "Jane",  // optional
 *   "lastName": "Smith",   // optional
 *   "email": "jane@example.com"  // optional
 * }
 */
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.post('/google', googleAuth);

// Export router to use in server.js
export default router;

/**
 * 🎓 LEARNING NOTES:
 * 
 * 1. ROUTE PATHS:
 *    - These are relative paths
 *    - In server.js, we mount this router at /api/auth
 *    - So POST /signup becomes POST /api/auth/signup
 *    - Complete URL: http://localhost:5000/api/auth/signup
 * 
 * 2. MIDDLEWARE EXECUTION ORDER:
 *    router.post('/signup', validation, controller)
 *                          ↓           ↓
 *                     runs first  runs second
 *    
 *    Multiple middleware:
 *    router.put('/profile', protect, validation, controller)
 *                          ↓        ↓           ↓
 *                       1st auth  2nd validate  3rd process
 * 
 * 3. HTTP METHOD SEMANTICS:
 *    - GET: Retrieve/read data (idempotent - same result every time)
 *    - POST: Create new resource
 *    - PUT: Update entire resource
 *    - PATCH: Update part of resource
 *    - DELETE: Remove resource
 * 
 * 4. PUBLIC vs PRIVATE ROUTES:
 *    - Public: No authentication needed
 *      Examples: signup, login, view products
 *    
 *    - Private: Authentication required (has 'protect' middleware)
 *      Examples: profile, update account, place order
 * 
 * 5. RESTful API DESIGN:
 *    - REST = Representational State Transfer
 *    - Standard way to design web APIs
 *    - Uses HTTP methods + resource paths
 *    
 *    Good design:
 *    GET    /api/users       - Get all users
 *    GET    /api/users/:id   - Get one user
 *    POST   /api/users       - Create user
 *    PUT    /api/users/:id   - Update user
 *    DELETE /api/users/:id   - Delete user
 * 
 * 6. ROUTE PARAMETERS:
 *    router.get('/users/:id', controller)
 *                      ↑
 *                  dynamic parameter
 *    
 *    Access in controller: req.params.id
 *    Example URL: /api/users/123
 *    req.params.id = '123'
 * 
 * 7. QUERY PARAMETERS:
 *    URL: /api/products?category=indoor&page=2
 *    Access: req.query.category, req.query.page
 * 
 * REAL-WORLD ANALOGY:
 * - Routes = Menu in a restaurant
 * - Each route = Menu item
 * - HTTP method = How you want it (GET=view, POST=order)
 * - Middleware = Special requests (no nuts, extra cheese)
 * - Controller = Chef preparing the order
 * - Response = Food served to you
 */
