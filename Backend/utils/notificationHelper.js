/**
 * 🔔 NOTIFICATION HELPER UTILITY
 * 
 * Helper functions to create notifications for various events
 * Use these functions throughout the application to maintain consistency
 */

import Notification from '../models/Notification.js';

/**
 * Create a notification for order placed event
 * @param {String} adminId - Admin user ID
 * @param {Object} orderData - Order information
 * @param {String} orderData.orderId - Order ID
 * @param {String} orderData.customerName - Customer name
 * @param {Number} orderData.itemCount - Number of items in order
 * @param {Number} orderData.totalPrice - Order total
 * @returns {Promise<Object>} Created notification document
 */
export const notifyOrderPlaced = async (adminId, orderData) => {
  try {
    const notification = new Notification({
      adminId,
      type: 'order_placed',
      title: `New Order #${orderData.orderId.toString().slice(-6).toUpperCase()}`,
      message: `${orderData.customerName} placed an order with ${orderData.itemCount} item(s) - ₹${orderData.totalPrice}`,
      relatedId: orderData.orderId,
      relatedType: 'order',
      data: {
        customerName: orderData.customerName,
        itemCount: orderData.itemCount,
        totalPrice: orderData.totalPrice,
      },
      priority: 'high',
      isRead: false,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating order placed notification:', error);
    throw error;
  }
};

/**
 * Create a notification for order updated event
 * @param {String} adminId - Admin user ID
 * @param {Object} orderData - Order information
 * @param {String} orderData.orderId - Order ID
 * @param {String} orderData.status - New status
 * @param {String} orderData.customerName - Customer name
 * @returns {Promise<Object>} Created notification document
 */
export const notifyOrderUpdated = async (adminId, orderData) => {
  try {
    const notification = new Notification({
      adminId,
      type: 'order_updated',
      title: `Order #${orderData.orderId.toString().slice(-6).toUpperCase()} Updated`,
      message: `Order status changed to ${orderData.status} for ${orderData.customerName}`,
      relatedId: orderData.orderId,
      relatedType: 'order',
      data: {
        customerName: orderData.customerName,
        status: orderData.status,
      },
      priority: 'medium',
      isRead: false,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating order updated notification:', error);
    throw error;
  }
};

/**
 * Create a notification for order cancelled event
 * @param {String} adminId - Admin user ID
 * @param {Object} orderData - Order information
 * @param {String} orderData.orderId - Order ID
 * @param {String} orderData.customerName - Customer name
 * @param {String} orderData.reason - Cancellation reason
 * @returns {Promise<Object>} Created notification document
 */
export const notifyOrderCancelled = async (adminId, orderData) => {
  try {
    const notification = new Notification({
      adminId,
      type: 'order_cancelled',
      title: `Order #${orderData.orderId.toString().slice(-6).toUpperCase()} Cancelled`,
      message: `Order from ${orderData.customerName} was cancelled. Reason: ${orderData.reason}`,
      relatedId: orderData.orderId,
      relatedType: 'order',
      data: {
        customerName: orderData.customerName,
        reason: orderData.reason,
      },
      priority: 'high',
      isRead: false,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating order cancelled notification:', error);
    throw error;
  }
};

/**
 * Create a notification for order delivered event
 * @param {String} adminId - Admin user ID
 * @param {Object} orderData - Order information
 * @param {String} orderData.orderId - Order ID
 * @param {String} orderData.customerName - Customer name
 * @returns {Promise<Object>} Created notification document
 */
export const notifyOrderDelivered = async (adminId, orderData) => {
  try {
    const notification = new Notification({
      adminId,
      type: 'order_delivered',
      title: `Order #${orderData.orderId.toString().slice(-6).toUpperCase()} Delivered`,
      message: `Order for ${orderData.customerName} has been delivered successfully`,
      relatedId: orderData.orderId,
      relatedType: 'order',
      data: {
        customerName: orderData.customerName,
      },
      priority: 'low',
      isRead: false,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating order delivered notification:', error);
    throw error;
  }
};

/**
 * Create a system alert notification
 * @param {String} adminId - Admin user ID
 * @param {String} title - Notification title
 * @param {String} message - Notification message
 * @param {String} priority - Priority level (low, medium, high, critical)
 * @returns {Promise<Object>} Created notification document
 */
export const notifySystemAlert = async (adminId, title, message, priority = 'medium') => {
  try {
    const notification = new Notification({
      adminId,
      type: 'system_alert',
      title,
      message,
      relatedType: 'system',
      data: {
        timestamp: new Date(),
      },
      priority,
      isRead: false,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating system alert notification:', error);
    throw error;
  }
};

/**
 * Get the first admin user (for notifying the primary admin)
 * This assumes there's at least one admin in the system
 * 
 * @returns {Promise<String>} Admin user ID
 */
export const getAdminId = async () => {
  try {
    import User from '../models/User.js';
    const admin = await User.findOne({ role: 'admin' });
    return admin ? admin._id : null;
  } catch (error) {
    console.error('Error getting admin ID:', error);
    return null;
  }
};

/**
 * Create a multi-admin notification
 * Send the same notification to all admins
 * 
 * @param {Array<String>} adminIds - Array of admin user IDs
 * @param {String} type - Notification type
 * @param {String} title - Notification title
 * @param {String} message - Notification message
 * @param {Object} data - Additional data
 * @param {String} priority - Priority level
 * @returns {Promise<Array>} Array of created notifications
 */
export const notifyAllAdmins = async (adminIds, type, title, message, data = {}, priority = 'medium') => {
  try {
    const notifications = await Promise.all(
      adminIds.map((adminId) =>
        new Notification({
          adminId,
          type,
          title,
          message,
          relatedType: data.relatedType || 'system',
          data,
          priority,
          isRead: false,
        }).save()
      )
    );

    return notifications;
  } catch (error) {
    console.error('Error creating multi-admin notifications:', error);
    throw error;
  }
};

export default {
  notifyOrderPlaced,
  notifyOrderUpdated,
  notifyOrderCancelled,
  notifyOrderDelivered,
  notifySystemAlert,
  getAdminId,
  notifyAllAdmins,
};
