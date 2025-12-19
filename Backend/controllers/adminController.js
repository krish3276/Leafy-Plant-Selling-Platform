/**
 * 🛠️ ADMIN CONTROLLER
 * Handles all admin-related operations
 */

import Product from '../models/Product.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Get admin dashboard data
export const getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).limit(5);
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        stats: {
          totalProducts,
          totalUsers,
          totalAdmins,
          lowStockCount: await Product.countDocuments({ stock: { $lt: 10 } }),
        },
        lowStockProducts,
        recentProducts,
      },
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get all products (with inactive ones) - Admin view
export const getAllProductsAdmin = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;

    let query = {}; // No isActive filter - admins see all products

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = {};
    if (sort === 'price-low') sortOption.price = 1;
    else if (sort === 'price-high') sortOption.price = -1;
    else if (sort === 'name') sortOption.name = 1;
    else if (sort === 'stock-low') sortOption.stock = 1;
    else sortOption.createdAt = -1;

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Create product (Admin)
export const createProductAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const product = await Product.create({
      ...req.body,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update product (Admin)
export const updateProductAdmin = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete product (Admin)
export const deleteProductAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    // Prevent removing last admin
    if (role === 'customer') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot remove the last admin',
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update Role Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Deactivate user
export const deactivateUser = async (req, res) => {
  try {
    // Cannot deactivate yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      user,
    });
  } catch (error) {
    console.error('Deactivate User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({
      role: 'customer',
      isActive: true,
    });
    const inactiveUsers = await User.countDocuments({
      role: 'customer',
      isActive: false,
    });

    const usersPerDay = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        activeUsers,
        inactiveUsers,
        usersPerDay,
      },
    });
  } catch (error) {
    console.error('User Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get order statistics (placeholder - adjust based on your Order model)
export const getOrderStats = async (req, res) => {
  try {
    // Placeholder stats - adjust based on your actual data
    res.status(200).json({
      success: true,
      stats: {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
      },
    });
  } catch (error) {
    console.error('Order Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * 🔧 ADMIN SETTINGS ENDPOINTS
 * Handle admin profile and account settings
 */

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    res.status(200).json({
      success: true,
      admin,
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

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    // Validate input
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required',
      });
    }

    const admin = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || '',
        address: address?.trim() || '',
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      admin,
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

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    // Get admin with password
    const admin = await User.findById(req.user.id).select('+password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Verify current password
    const isPasswordCorrect = await admin.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get system settings
export const getSystemSettings = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      settings: {
        appName: 'Leafy Plants',
        version: '1.0.0',
        maintenanceMode: false,
        emailNotifications: true,
        siteBackups: 'Daily',
        maxLoginAttempts: 5,
        sessionTimeout: 30,
        maxProductsPerPage: 10,
      },
    });
  } catch (error) {
    console.error('Get Settings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
