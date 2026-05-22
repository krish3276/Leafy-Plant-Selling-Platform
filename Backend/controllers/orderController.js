import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { syncGardenPlantsFromOrder } from './gardenController.js';
import { createNotification } from './notificationController.js';
import { getRazorpayInstance } from '../config/razorpay.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    const normalizedPaymentMethod = paymentMethod === 'cod' ? 'cod' : 'card';
    const trimmedNotes = typeof notes === 'string' ? notes.trim() : '';

    if (trimmedNotes.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Notes cannot exceed 500 characters',
      });
    }

    // Get user with cart
    const user = await User.findById(req.user.id).populate('cart.productId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || 
        !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address',
      });
    }

    // Build order items and calculate totals
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of user.cart) {
      const product = cartItem.productId;

      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'One or more products in your cart are no longer available',
        });
      }

      if (!cartItem.quantity || cartItem.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.name}`,
        });
      }

      // Check stock
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image,
      });

      subtotal += product.price * cartItem.quantity;
    }

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid items in cart',
      });
    }

    // Calculate tax and shipping
    const tax = subtotal * 0.08; // 8% tax
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shippingCost;

    // Create order
    const orderPayload = {
      user: req.user.id,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        zipCode: shippingAddress.zipCode.trim(),
        phone: shippingAddress.phone.trim(),
      },
      paymentMethod: normalizedPaymentMethod,
      subtotal,
      tax,
      shippingCost,
      total,
      notes: trimmedNotes || undefined,
      orderStatus: 'confirmed',
      paymentStatus: normalizedPaymentMethod === 'cod' ? 'pending' : 'paid',
    };

    let order;
    try {
      order = await Order.create(orderPayload);
    } catch (createError) {
      if (createError.code === 11000) {
        order = await Order.create({ ...orderPayload });
      } else {
        throw createError;
      }
    }

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    user.cart = [];
    await user.save();

    // Notify all admins about the new order
    try {
      const admins = await User.find({ role: 'admin' }).select('_id firstName lastName email');

      const notificationPayload = {
        type: 'order_placed',
        title: `New Order: ${order.orderNumber}`,
        message: `A new order (${order.orderNumber}) was placed by ${user.firstName} ${user.lastName}.`,
        relatedId: order._id,
        relatedType: 'order',
        data: {
          orderId: order._id,
          total: order.total,
        },
        priority: 'high',
      };

      for (const admin of admins) {
        // createNotification returns the created notification or null on error
        // run without awaiting to avoid delaying response too long
        createNotification(admin._id, notificationPayload).catch((err) =>
          console.error('Failed to create admin notification:', err)
        );
      }
    } catch (notifyErr) {
      console.error('Error notifying admins about new order:', notifyErr);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        items: order.items,
        shippingAddress: order.shippingAddress,
        subtotal: order.subtotal,
        tax: order.tax,
        shippingCost: order.shippingCost,
        total: order.total,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('items.product', 'name image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Track order (customer view)
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    })
      .populate('items.product', 'name image')
      .populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const trackingSteps = [
      { key: 'confirmed', label: 'Order Confirmed' },
      { key: 'processing', label: 'Processing' },
      { key: 'shipped', label: 'Shipped' },
      { key: 'delivered', label: 'Delivered' },
    ];

    const currentStepIndex = trackingSteps.findIndex((step) => step.key === order.orderStatus);
    const safeCurrentStepIndex = currentStepIndex === -1 ? 0 : currentStepIndex;
    const isCancelled = order.orderStatus === 'cancelled';

    const estimatedDeliveryDate = (() => {
      if (order.orderStatus === 'delivered') {
        return order.deliveredAt || order.updatedAt;
      }

      if (isCancelled) {
        return null;
      }

      const startDate = new Date(order.createdAt);
      const deliveryOffsetDays = order.orderStatus === 'shipped' ? 2 : 5;
      startDate.setDate(startDate.getDate() + deliveryOffsetDays);
      return startDate;
    })();

    const tracking = {
      orderId: order._id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      currentStep: isCancelled ? 'Cancelled' : trackingSteps[safeCurrentStepIndex].label,
      currentStepIndex: isCancelled ? -1 : safeCurrentStepIndex,
      totalSteps: trackingSteps.length,
      progress: isCancelled ? 0 : Math.round(((safeCurrentStepIndex + 1) / trackingSteps.length) * 100),
      estimatedDeliveryDate,
      canCancel: ['pending', 'confirmed'].includes(order.orderStatus),
      timestamps: {
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deliveredAt: order.deliveredAt || null,
        cancelledAt: order.cancelledAt || null,
      },
      steps: trackingSteps.map((step, index) => ({
        key: step.key,
        label: step.label,
        completed: !isCancelled && index <= safeCurrentStepIndex,
        active: !isCancelled && index === safeCurrentStepIndex,
      })),
    };

    res.status(200).json({
      success: true,
      order,
      tracking,
    });
  } catch (error) {
    console.error('Track Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Cancel order (only if pending or confirmed)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Allow cancellation for orders that haven't been delivered yet
    const cancellableStatuses = ['pending', 'confirmed', 'processing', 'shipped'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.orderStatus}. Orders can only be cancelled before delivery.`,
      });
    }

    // Handle Razorpay refund if payment was made via Razorpay
    let refundDetails = null;
    if (
      order.paymentMethod === 'razorpay' &&
      order.paymentStatus === 'paid' &&
      order.razorpayPaymentId
    ) {
      try {
        const razorpay = getRazorpayInstance();
        if (razorpay) {
          const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
            amount: Math.round(order.total * 100), // Convert to paise
            notes: {
              reason: 'Order cancelled by customer',
              orderId: order._id.toString(),
              orderNumber: order.orderNumber,
            },
          });

          if (refund && refund.id) {
            order.razorpayRefundId = refund.id;
            order.paymentStatus = 'refunded';
            order.refundedAt = new Date();
            refundDetails = {
              refundId: refund.id,
              amount: order.total,
              status: refund.status,
            };
          }
        }
      } catch (refundError) {
        console.error('Razorpay Refund Error:', refundError);
        // Log the error but don't fail the cancellation
        // The refund can be retried later
        return res.status(400).json({
          success: false,
          message: 'Failed to process refund. Please contact support.',
          error: refundError.message,
        });
      }
    } else if (order.paymentMethod === 'cod') {
      // COD orders don't need refund processing
      order.paymentStatus = 'pending';
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    // Create notification for user about cancellation
    try {
      const user = await User.findById(order.user).select('_id firstName lastName');
      const notificationPayload = {
        type: 'order_cancelled',
        title: `Order Cancelled: ${order.orderNumber}`,
        message: refundDetails
          ? `Your order has been cancelled. A refund of ₹${order.total.toFixed(2)} will be processed to your Razorpay account within 5-7 business days.`
          : `Your order has been cancelled.`,
        relatedId: order._id,
        relatedType: 'order',
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          refund: refundDetails,
        },
        priority: 'high',
      };

      await createNotification(order.user, notificationPayload);

      // Also notify admins
      const admins = await User.find({ role: 'admin' }).select('_id firstName lastName email');
      const adminNotificationPayload = {
        type: 'order_cancelled',
        title: `Order Cancelled: ${order.orderNumber}`,
        message: `Order ${order.orderNumber} by ${user.firstName} ${user.lastName} has been cancelled.`,
        relatedId: order._id,
        relatedType: 'order',
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          cancelledBy: 'customer',
        },
        priority: 'medium',
      };

      for (const admin of admins) {
        createNotification(admin._id, adminNotificationPayload).catch((err) =>
          console.error('Failed to create admin notification:', err)
        );
      }
    } catch (notifyErr) {
      console.error('Error creating notifications:', notifyErr);
      // Don't fail the cancellation if notification fails
    }

    res.status(200).json({
      success: true,
      message: refundDetails
        ? 'Order cancelled successfully. Refund has been initiated and will appear in your account within 5-7 business days.'
        : 'Order cancelled successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        cancelledAt: order.cancelledAt,
        refund: refundDetails,
        total: order.total,
      },
    });
  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order',
      error: error.message,
    });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};
    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
        { 'shippingAddress.address': { $regex: search, $options: 'i' } },
        { 'shippingAddress.city': { $regex: search, $options: 'i' } },
        { 'items.name': { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name');

    const total = await Order.countDocuments(query);
    const summaryResult = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] },
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'confirmed'] }, 1, 0] },
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'processing'] }, 1, 0] },
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'shipped'] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] },
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $ne: ['$orderStatus', 'cancelled'] },
                '$total',
                0,
              ],
            },
          },
        },
      },
    ]);

    const summary = summaryResult[0] || {
      totalOrders: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0,
    };

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      summary,
      orders,
    });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orderStatus) {
      const wasDelivered = order.orderStatus === 'delivered';
      order.orderStatus = orderStatus;
      if (orderStatus === 'delivered') {
        order.deliveredAt = new Date();
      } else {
        order.deliveredAt = null;
      }

      if (orderStatus === 'cancelled') {
        order.cancelledAt = new Date();
      } else {
        order.cancelledAt = null;
      }

      if (!wasDelivered && orderStatus === 'delivered') {
        await syncGardenPlantsFromOrder(order.user, order);
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    // Notify admins about order status change
    try {
      const admins = await User.find({ role: 'admin' }).select('_id firstName lastName email');

      let notifType = 'order_updated';
      if (order.orderStatus === 'delivered') notifType = 'order_delivered';
      if (order.orderStatus === 'cancelled') notifType = 'order_cancelled';

      const notificationPayload = {
        type: notifType,
        title: `Order ${order.orderNumber} - ${order.orderStatus}`,
        message: `Order ${order.orderNumber} status changed to ${order.orderStatus}.`,
        relatedId: order._id,
        relatedType: 'order',
        data: {
          orderId: order._id,
          orderStatus: order.orderStatus,
        },
        priority: order.orderStatus === 'cancelled' ? 'high' : 'medium',
      };

      for (const admin of admins) {
        createNotification(admin._id, notificationPayload).catch((err) =>
          console.error('Failed to create order status notification:', err)
        );
      }
    } catch (notifyErr) {
      console.error('Error notifying admins about order update:', notifyErr);
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
