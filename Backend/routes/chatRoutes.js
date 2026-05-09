import express from 'express';
import { chat } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat
// Body: { messages: [{ role: 'user' | 'assistant', content: string }] }
// Returns: Server-Sent Events stream of { text } chunks, terminated by [DONE]
router.post('/', chat);

export default router;
