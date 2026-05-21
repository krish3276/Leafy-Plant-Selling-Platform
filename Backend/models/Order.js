import mongoose from 'mongoose';

const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `LF${year}${month}${day}${timestamp}${random}`;
};

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    orderNumber: {
      type: String,
      unique: true,
      required: true,
      default: generateOrderNumber,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        category: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: String,
      },
    ],

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },

    paymentMethod: {
      type: String,
      enum: ['card', 'cod', 'razorpay'],
      default: 'card',
    },

    // Razorpay transaction references (populated after successful payment)
    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    subtotal: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      required: true,
    },

    shippingCost: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    notes: {
      type: String,
      maxlength: 500,
    },

    deliveredAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
