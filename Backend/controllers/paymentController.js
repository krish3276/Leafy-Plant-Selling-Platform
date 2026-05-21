import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { syncGardenPlantsFromOrder } from './gardenController.js';
import { createNotification } from './notificationController.js';

// ─── GET KEY ────────────────────────────────────────────────────────────────
// Returns the Razorpay key_id to the frontend so it never has to be hardcoded
export const getRazorpayKey = (req, res) => {
  res.status(200).json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
};

// ─── CREATE RAZORPAY ORDER ───────────────────────────────────────────────────
// Step 1 of the payment flow: Creates a Razorpay order and returns its ID.
// The actual DB Order is NOT saved yet — that happens after payment verification.
export const createRazorpayOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Calculate total in paise (INR × 100)
    let subtotal = 0;
    for (const cartItem of user.cart) {
      const product = cartItem.productId;
      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'One or more products in your cart are no longer available',
        });
      }
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`,
        });
      }
      subtotal += product.price * cartItem.quantity;
    }

    const tax = subtotal * 0.08;
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const totalINR = subtotal + tax + shippingCost;
    const amountInPaise = Math.round(totalINR * 100); // Razorpay requires paise

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `leafy_rcpt_${Date.now()}`,
      notes: {
        userId: req.user.id,
        userEmail: user.email,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,       // in paise
      amountINR: totalINR,                // in rupees (for display)
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
    });
  } catch (error) {
    console.error('Create Razorpay Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate payment', error: error.message });
  }
};

// ─── VERIFY PAYMENT & SAVE ORDER ─────────────────────────────────────────────
// Step 2: Frontend sends back the Razorpay response. We verify the HMAC
// signature, then create the DB Order exactly as the existing createOrder does.
export const verifyAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
      notes,
    } = req.body;

    // ── Signature Verification ──────────────────────────────────────────────
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Signature mismatch.',
      });
    }

    // ── Validate Shipping Address ───────────────────────────────────────────
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a complete shipping address',
      });
    }

    // ── Build Order From Cart ───────────────────────────────────────────────
    const user = await User.findById(req.user.id).populate('cart.productId');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

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

    const tax = subtotal * 0.08;
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shippingCost;
    const trimmedNotes = typeof notes === 'string' ? notes.trim() : '';

    // ── Save Order to DB ────────────────────────────────────────────────────
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
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      subtotal,
      tax,
      shippingCost,
      total,
      notes: trimmedNotes || undefined,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    };

    const order = await Order.create(orderPayload);

    // ── Deduct Stock & Clear Cart ───────────────────────────────────────────
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    user.cart = [];
    await user.save();

    // ── Notify Admins ───────────────────────────────────────────────────────
    try {
      const admins = await User.find({ role: 'admin' }).select('_id firstName lastName email');
      const notificationPayload = {
        type: 'order_placed',
        title: `New Order: ${order.orderNumber}`,
        message: `A new order (${order.orderNumber}) was placed by ${user.firstName} ${user.lastName} via Razorpay.`,
        relatedId: order._id,
        relatedType: 'order',
        data: { orderId: order._id, total: order.total },
        priority: 'high',
      };
      for (const admin of admins) {
        createNotification(admin._id, notificationPayload).catch((err) =>
          console.error('Failed to create admin notification:', err)
        );
      }
    } catch (notifyErr) {
      console.error('Error notifying admins:', notifyErr);
    }

    res.status(201).json({
      success: true,
      message: 'Payment verified and order placed successfully! 🌱',
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
        paymentMethod: order.paymentMethod,
        razorpayPaymentId: order.razorpayPaymentId,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ success: false, message: 'Server error during payment verification', error: error.message });
  }
};
