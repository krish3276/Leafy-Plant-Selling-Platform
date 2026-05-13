/**
 * 🛠️ ADMIN CONTROLLER
 * Handles all admin-related operations
 */

import Product from '../models/Product.js';
import User from '../models/User.js';
import NotificationPreferences from '../models/NotificationPreferences.js';
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

/**
 * 🔔 NOTIFICATION PREFERENCES ENDPOINTS
 * Handle admin notification settings and preferences
 */

// Get notification preferences for admin
export const getNotificationPreferences = async (req, res) => {
  try {
    let preferences = await NotificationPreferences.findOne({
      adminId: req.user.id,
    });

    // If no preferences exist, create default ones
    if (!preferences) {
      preferences = await NotificationPreferences.create({
        adminId: req.user.id,
      });
    }

    res.status(200).json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error('Get Notification Preferences Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update specific notification type preferences
export const updateNotificationTypePreference = async (req, res) => {
  try {
    const { notificationType, email, push, inApp, enabled } = req.body;

    // Validate notification type
    const validTypes = [
      'orderPlaced',
      'orderUpdated',
      'orderCancelled',
      'orderDelivered',
      'systemAlert',
      'productUpdates',
    ];

    if (!validTypes.includes(notificationType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid notification type. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    // Find or create preferences
    let preferences = await NotificationPreferences.findOne({
      adminId: req.user.id,
    });

    if (!preferences) {
      preferences = await NotificationPreferences.create({
        adminId: req.user.id,
      });
    }

    // Update the specific notification type preferences
    const updateData = {};

    if (enabled !== undefined) {
      updateData[`preferences.${notificationType}.enabled`] = enabled;
    }
    if (email !== undefined) {
      updateData[`preferences.${notificationType}.email`] = email;
    }
    if (push !== undefined) {
      updateData[`preferences.${notificationType}.push`] = push;
    }
    if (inApp !== undefined) {
      updateData[`preferences.${notificationType}.inApp`] = inApp;
    }
    updateData.lastUpdated = new Date();

    const updatedPreferences = await NotificationPreferences.findByIdAndUpdate(
      preferences._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `${notificationType} preferences updated successfully`,
      preferences: updatedPreferences,
    });
  } catch (error) {
    console.error('Update Notification Type Preference Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update all notification preferences at once
export const updateAllNotificationPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Valid preferences object is required',
      });
    }

    let notificationPrefs = await NotificationPreferences.findOne({
      adminId: req.user.id,
    });

    if (!notificationPrefs) {
      notificationPrefs = await NotificationPreferences.create({
        adminId: req.user.id,
        preferences,
      });
    } else {
      notificationPrefs.preferences = preferences;
      notificationPrefs.lastUpdated = new Date();
      await notificationPrefs.save();
    }

    res.status(200).json({
      success: true,
      message: 'All notification preferences updated successfully',
      preferences: notificationPrefs,
    });
  } catch (error) {
    console.error('Update All Preferences Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update global notification settings
export const updateGlobalNotificationSettings = async (req, res) => {
  try {
    const {
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
      frequency,
      doNotDisturb,
      soundEnabled,
      desktopNotifications,
    } = req.body;

    // Validate frequency value
    if (
      frequency &&
      !['immediate', 'daily_digest', 'weekly_digest'].includes(frequency)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid frequency. Must be: immediate, daily_digest, or weekly_digest',
      });
    }

    // Validate quiet hours format (HH:mm)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (quietHoursStart && !timeRegex.test(quietHoursStart)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quietHoursStart format. Use HH:mm (24-hour format)',
      });
    }
    if (quietHoursEnd && !timeRegex.test(quietHoursEnd)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quietHoursEnd format. Use HH:mm (24-hour format)',
      });
    }

    // Find or create preferences
    let preferences = await NotificationPreferences.findOne({
      adminId: req.user.id,
    });

    if (!preferences) {
      preferences = await NotificationPreferences.create({
        adminId: req.user.id,
      });
    }

    // Update global settings
    const updateData = {};

    if (quietHoursEnabled !== undefined) {
      updateData['globalSettings.quietHoursEnabled'] = quietHoursEnabled;
    }
    if (quietHoursStart !== undefined) {
      updateData['globalSettings.quietHoursStart'] = quietHoursStart;
    }
    if (quietHoursEnd !== undefined) {
      updateData['globalSettings.quietHoursEnd'] = quietHoursEnd;
    }
    if (frequency !== undefined) {
      updateData['globalSettings.frequency'] = frequency;
    }
    if (doNotDisturb !== undefined) {
      updateData['globalSettings.doNotDisturb'] = doNotDisturb;
    }
    if (soundEnabled !== undefined) {
      updateData['globalSettings.soundEnabled'] = soundEnabled;
    }
    if (desktopNotifications !== undefined) {
      updateData['globalSettings.desktopNotifications'] = desktopNotifications;
    }
    updateData.lastUpdated = new Date();

    const updatedPreferences = await NotificationPreferences.findByIdAndUpdate(
      preferences._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Global notification settings updated successfully',
      preferences: updatedPreferences,
    });
  } catch (error) {
    console.error('Update Global Settings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Reset notification preferences to defaults
export const resetNotificationPreferences = async (req, res) => {
  try {
    const preferences = await NotificationPreferences.findOne({
      adminId: req.user.id,
    });

    if (!preferences) {
      return res.status(404).json({
        success: false,
        message: 'No notification preferences found',
      });
    }

    // Reset to default schema values
    await NotificationPreferences.deleteOne({ _id: preferences._id });

    // Create new with defaults
    const newPreferences = await NotificationPreferences.create({
      adminId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: 'Notification preferences reset to defaults',
      preferences: newPreferences,
    });
  } catch (error) {
    console.error('Reset Preferences Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get notification preferences summary
export const getNotificationPreferencesSummary = async (req, res) => {
  try {
    const preferences = await NotificationPreferences.findOne({
      adminId: req.user.id,
    });

    if (!preferences) {
      return res.status(404).json({
        success: false,
        message: 'No notification preferences found',
      });
    }

    // Generate summary
    const summary = {
      enabledNotifications: [],
      disabledNotifications: [],
      emailEnabled: 0,
      pushEnabled: 0,
      inAppEnabled: 0,
      globalSettings: preferences.globalSettings,
    };

    // Count enabled/disabled and channels
    Object.entries(preferences.preferences).forEach(([type, settings]) => {
      if (settings.enabled) {
        summary.enabledNotifications.push(type);
      } else {
        summary.disabledNotifications.push(type);
      }

      if (settings.email) summary.emailEnabled++;
      if (settings.push) summary.pushEnabled++;
      if (settings.inApp) summary.inAppEnabled++;
    });

    res.status(200).json({
      success: true,
      summary,
      fullPreferences: preferences,
    });
  } catch (error) {
    console.error('Get Preferences Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

