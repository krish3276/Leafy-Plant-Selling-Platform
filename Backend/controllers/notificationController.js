/**
 * 🔔 NOTIFICATION CONTROLLER
 * Handles admin notifications for orders and system events
 */

import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Get all notifications for admin
export const getNotifications = async (req, res) => {
  try {
    const { filter = 'all', limit = 20, page = 1 } = req.query;

    let query = { adminId: req.user.id };

    // Filter by read status
    if (filter === 'unread') {
      query.isRead = false;
    } else if (filter === 'read') {
      query.isRead = true;
    }

    // Count total notifications
    const total = await Notification.countDocuments(query);

    // Fetch notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('adminId', 'firstName lastName email')
      .lean();

    res.status(200).json({
      success: true,
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      adminId: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    console.error('Get Unread Count Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    console.error('Mark as Read Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { adminId: req.user.id, isRead: false },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      updated: result.modifiedCount,
    });
  } catch (error) {
    console.error('Mark All as Read Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete all notifications
export const deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      adminId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: 'All notifications deleted',
      deleted: result.deletedCount,
    });
  } catch (error) {
    console.error('Delete All Notifications Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Create notification (Internal use - called by other controllers)
export const createNotification = async (adminId, notificationData) => {
  try {
    const notification = await Notification.create({
      adminId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      relatedId: notificationData.relatedId || null,
      relatedType: notificationData.relatedType || 'system',
      data: notificationData.data || {},
      priority: notificationData.priority || 'medium',
    });

    return notification;
  } catch (error) {
    console.error('Create Notification Error:', error);
    return null;
  }
};

// Get notification stats
export const getNotificationStats = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      adminId: req.user.id,
      isRead: false,
    });

    const totalCount = await Notification.countDocuments({
      adminId: req.user.id,
    });

    const byType = await Notification.aggregate([
      { $match: { adminId: req.user.id } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const byPriority = await Notification.aggregate([
      { $match: { adminId: req.user.id } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        unreadCount,
        totalCount,
        byType,
        byPriority,
      },
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
