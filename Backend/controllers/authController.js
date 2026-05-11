import User from '../models/User.js';
import Product from '../models/Product.js';
import { validationResult } from 'express-validator';

export const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // 2. EXTRACT DATA FROM REQUEST BODY
    // req.body contains the JSON data sent from frontend
    const { firstName, lastName, email, password } = req.body;

    // 3. CHECK IF USER ALREADY EXISTS
    // findOne() searches for one document matching the query
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered. Please login instead.',
      });
    }

    // 4. CREATE NEW USER
    // User.create() creates a new document in the users collection
    // The password will be automatically hashed by the pre-save middleware
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // 5. GENERATE JWT TOKEN
    // Use the method we defined in User model
    const token = user.generateAuthToken();

    // 6. SEND RESPONSE
    // Don't send password back (even though it's hashed)
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token, // JWT token for authentication
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Contact support.',
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('wishlist', 'name image price category stock isActive');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is no longer available',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const alreadySaved = user.wishlist.some(
      (savedProductId) => savedProductId.toString() === productId
    );

    if (!alreadySaved) {
      user.wishlist.push(productId);
      await user.save();
    }

    const updatedUser = await User.findById(req.user.id)
      .select('-password')
      .populate('wishlist', 'name image price category stock isActive');

    res.status(200).json({
      success: true,
      message: alreadySaved ? 'Product is already in wishlist' : 'Product added to wishlist',
      wishlist: updatedUser.wishlist,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Add Wishlist Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * 🔄 CONTROLLER: UPDATE USER PROFILE
 * 
 * PURPOSE: Update user's account information
 * 
 * CAN UPDATE:
 * - firstName
 * - lastName
 * - email (if not already taken)
 */
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    // Build update object (only include fields that were sent)
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;

    // Check if email is already taken by another user
    if (email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: req.user.id }, // $ne = "not equal" - exclude current user
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
    }

    // Update user
    // findByIdAndUpdate(id, update, options)
    // new: true returns the updated document
    // runValidators: true runs schema validations
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * 🎓 LEARNING NOTES:
 * 
 * 1. ASYNC/AWAIT:
 *    - Database operations are asynchronous (take time)
 *    - 'await' pauses execution until operation completes
 *    - Must use 'try-catch' to handle errors
 * 
 * 2. REQ AND RES OBJECTS:
 *    - req (request): contains data FROM frontend
 *      - req.body: JSON data sent in request
 *      - req.params: URL parameters (/user/:id)
 *      - req.query: Query string (?page=1)
 *      - req.user: Added by middleware (user info from JWT)
 *    
 *    - res (response): sends data BACK to frontend
 *      - res.status(): set HTTP status code
 *      - res.json(): send JSON response
 *      - res.send(): send various types of response
 * 
 * 3. ERROR HANDLING:
 *    - Always wrap async code in try-catch
 *    - Send meaningful error messages
 *    - Use appropriate status codes
 *    - Log errors for debugging
 * 
 * 4. SECURITY PRACTICES:
 *    - Never send passwords in response
 *    - Hash passwords before storing
 *    - Use generic error messages (don't reveal if email exists)
 *    - Validate all user input
 */
