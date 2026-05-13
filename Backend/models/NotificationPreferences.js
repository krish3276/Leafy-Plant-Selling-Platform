import mongoose from 'mongoose';

const notificationPreferencesSchema = new mongoose.Schema(
  {
    // Admin user reference
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Notification type preferences
    preferences: {
      // Order notifications
      orderPlaced: {
        enabled: {
          type: Boolean,
          default: true,
        },
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        inApp: {
          type: Boolean,
          default: true,
        },
      },

      // Order updated notifications
      orderUpdated: {
        enabled: {
          type: Boolean,
          default: true,
        },
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        inApp: {
          type: Boolean,
          default: true,
        },
      },

      // Order cancelled notifications
      orderCancelled: {
        enabled: {
          type: Boolean,
          default: true,
        },
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: false,
        },
        inApp: {
          type: Boolean,
          default: true,
        },
      },

      // Order delivered notifications
      orderDelivered: {
        enabled: {
          type: Boolean,
          default: true,
        },
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        inApp: {
          type: Boolean,
          default: true,
        },
      },

      // System alerts
      systemAlert: {
        enabled: {
          type: Boolean,
          default: true,
        },
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        inApp: {
          type: Boolean,
          default: true,
        },
      },

      // Product updates
      productUpdates: {
        enabled: {
          type: Boolean,
          default: true,
        },
        email: {
          type: Boolean,
          default: false,
        },
        push: {
          type: Boolean,
          default: true,
        },
        inApp: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Global notification settings
    globalSettings: {
      // Quiet hours (from - to in 24h format)
      quietHoursEnabled: {
        type: Boolean,
        default: false,
      },
      quietHoursStart: {
        type: String, // Format: "HH:mm"
        default: '22:00',
      },
      quietHoursEnd: {
        type: String, // Format: "HH:mm"
        default: '08:00',
      },

      // Notification frequency (immediate, daily_digest, weekly_digest)
      frequency: {
        type: String,
        enum: ['immediate', 'daily_digest', 'weekly_digest'],
        default: 'immediate',
      },

      // Do not disturb
      doNotDisturb: {
        type: Boolean,
        default: false,
      },

      // Sound enabled
      soundEnabled: {
        type: Boolean,
        default: true,
      },

      // Desktop notifications
      desktopNotifications: {
        type: Boolean,
        default: true,
      },
    },

    // Last updated timestamp
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('NotificationPreferences', notificationPreferencesSchema);
