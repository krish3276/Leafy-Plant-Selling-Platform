import express from 'express';
import {
  submitContactMessage,
  getAllContactMessages,
  getContactMessage,
  updateContactMessage,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public route: submit contact message
router.post('/', submitContactMessage);

// Admin routes (require authentication and admin role)
router.get('/', protect, adminOnly, getAllContactMessages);
router.get('/:id', protect, adminOnly, getContactMessage);
router.put('/:id', protect, adminOnly, updateContactMessage);
router.delete('/:id', protect, adminOnly, deleteContactMessage);

export default router;
