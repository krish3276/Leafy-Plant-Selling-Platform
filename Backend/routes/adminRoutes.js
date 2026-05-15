/**
 * 🔐 ADMIN ROUTES
 * Protected routes for admin operations
 */

import express from 'express';
import {
  getDashboard,
  getAllProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  getAllUsers,
  getUserStats,
  getOrderStats,
  updateUserRole,
  deactivateUser,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  getSystemSettings,
  getNotificationPreferences,
  updateNotificationTypePreference,
  updateAllNotificationPreferences,
  updateGlobalNotificationSettings,
  resetNotificationPreferences,
  getNotificationPreferencesSummary,
} from '../controllers/adminController.js';
import {
  uploadProductImage,
  updateProductImage,
  deleteProductImage,
} from '../controllers/uploadController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard', getDashboard);

// Product Management
router.get('/products', getAllProductsAdmin);
router.post('/products', createProductAdmin);
router.put('/products/:id', updateProductAdmin);
router.delete('/products/:id', deleteProductAdmin);

// Image Upload Routes
router.post('/upload-image', upload.single('image'), uploadProductImage);
router.put('/products/:id/upload-image', upload.single('image'), updateProductImage);
router.delete('/products/:id/image', deleteProductImage);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/deactivate', deactivateUser);

// Admin Settings
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.put('/change-password', changePassword);
router.get('/settings', getSystemSettings);

// Statistics
router.get('/stats/users', getUserStats);
router.get('/stats/orders', getOrderStats);

// Notification Preferences Routes
router.get('/notifications/preferences', getNotificationPreferences);
router.get('/notifications/preferences/summary', getNotificationPreferencesSummary);
router.put('/notifications/preferences/type', updateNotificationTypePreference);
router.put('/notifications/preferences/all', updateAllNotificationPreferences);
router.put('/notifications/preferences/global', updateGlobalNotificationSettings);
router.post('/notifications/preferences/reset', resetNotificationPreferences);

export default router;
