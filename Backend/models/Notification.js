import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // Admin who receives the notification
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Notification type (order_placed, order_updated, order_cancelled, etc.)
    type: {
      type: String,
      enum: ['order_placed', 'order_updated', 'order_cancelled', 'order_delivered', 'system_alert'],
      required: true,
    },

    // Title of notification
    title: {
      type: String,
      required: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    // Detailed message
    message: {
      type: String,
      required: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },

    // Related entity (order ID, user ID, product ID)
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },

    // Entity type (order, user, product)
    relatedType: {
      type: String,
      enum: ['order', 'user', 'product', 'system'],
      default: 'order',
    },

    // Additional data (JSON object for flexible data storage)
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Read status
    isRead: {
      type: Boolean,
      default: false,
    },

    // Urgency/Priority (low, medium, high, critical)
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },

    // Timestamp
    createdAt: {
      type: Date,
      default: Date.now,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
notificationSchema.index({ adminId: 1, createdAt: -1 });
notificationSchema.index({ adminId: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
