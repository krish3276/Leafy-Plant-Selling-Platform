import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. CHECK IF TOKEN EXISTS
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.',
      });
    }

    // 3. VERIFY TOKEN
    // jwt.verify() checks:
    // - Token hasn't been tampered with
    // - Token hasn't expired
    // - Token was signed with our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded looks like: { id: '123abc', role: 'customer', iat: 1234567890, exp: 1234567890 }
    // iat = "issued at" timestamp
    // exp = "expires at" timestamp

    // 4. FIND USER BY ID FROM TOKEN
    // select('-password') excludes password field
    req.user = await User.findById(decoded.id).select('-password');

    // 5. CHECK IF USER EXISTS
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
      });
    }

    // 6. CHECK IF ACCOUNT IS ACTIVE
    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.',
      });
    }

    // 7. PROCEED TO NEXT MIDDLEWARE/CONTROLLER
    // next() tells Express to move to the next function in the chain
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message,
    });
  }
};

/**
 * 👮 ADMIN ONLY MIDDLEWARE
 * 
 * PURPOSE: Restrict access to admin users only
 * 
 * MUST BE USED AFTER protect MIDDLEWARE:
 * router.get('/admin-only', protect, adminOnly, controller)
 *                            ↑       ↑
 *                      verify JWT  check role
 * 
 * HOW IT WORKS:
 * - Assumes req.user is already set by protect middleware
 * - Checks if user.role === 'admin'
 * - If yes, proceed; if no, send 403 Forbidden
 */
export const adminOnly = (req, res, next) => {
  // Check if user exists and is admin
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, proceed
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
};

/**
 * 📊 OPTIONAL AUTH MIDDLEWARE
 * 
 * PURPOSE: Attach user info if token exists, but don't require it
 * 
 * USE CASE: Routes that work for both logged-in and guest users
 * Example: Product listing (guests can view, but logged-in users see favorites)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }

    // Always call next(), whether token exists or not
    next();
  } catch (error) {
    // Even if token verification fails, continue
    // Just don't set req.user
    next();
  }
};

/**
 * 🎓 LEARNING NOTES:
 * 
 * 1. NEXT() FUNCTION:
 *    - Express middleware chain uses next()
 *    - Calling next() passes control to next function
 *    - Not calling next() stops the chain
 *    - Calling next(error) jumps to error handler
 * 
 * 2. MIDDLEWARE ORDER MATTERS:
 *    ✅ Correct: app.get('/profile', protect, getProfile)
 *    ❌ Wrong:   app.get('/profile', getProfile, protect)
 * 
 * 3. REQ OBJECT MODIFICATIONS:
 *    - Middleware can add properties to req
 *    - protect adds req.user
 *    - Later middleware/controllers can access it
 *    - Each request has its own req object
 * 
 * 4. STATUS CODES:
 *    - 401 Unauthorized: Authentication required/failed
 *    - 403 Forbidden: Authenticated but no permission
 *    - 401 = "Who are you?" | 403 = "I know who you are, but you can't do this"
 * 
 * 5. JWT SECURITY:
 *    - Tokens are stateless (server doesn't store them)
 *    - Frontend stores token (localStorage/cookies)
 *    - Frontend sends token with every request
 *    - Server verifies token on each request
 *    - Tokens expire after set time (JWT_EXPIRE)
 * 
 * REAL-WORLD ANALOGY:
 * - JWT Token = Your ID card
 * - protect middleware = Security guard checking your ID
 * - adminOnly = VIP area requiring special badge
 * - next() = "You may proceed"
 */
