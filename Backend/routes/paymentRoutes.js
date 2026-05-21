import express from 'express';
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyAndCreateOrder,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/payment/key — returns key_id to frontend
router.get('/key', protect, getRazorpayKey);

// POST /api/payment/create-order — creates Razorpay order, returns order_id + amount
router.post('/create-order', protect, createRazorpayOrder);

// POST /api/payment/verify — verifies HMAC signature, saves DB order, clears cart
router.post('/verify', protect, verifyAndCreateOrder);

export default router;
