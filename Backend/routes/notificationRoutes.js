/**
 * 🔔 NOTIFICATION ROUTES
 * Routes for notification management
 */

import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats,
} from '../controllers/notificationController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All notification routes require authentication and admin role
router.use(protect, adminOnly);

// Get all notifications
router.get('/', getNotifications);

// Get unread count
router.get('/unread/count', getUnreadCount);

// Get notification stats
router.get('/stats', getNotificationStats);

// Mark all notifications as read (must be before /:notificationId/read)
router.put('/all/read', markAllAsRead);

// Mark specific notification as read
router.put('/:notificationId/read', markAsRead);

// Delete specific notification
router.delete('/:notificationId', deleteNotification);

// Delete all notifications
router.delete('/all', deleteAllNotifications);

export default router;
