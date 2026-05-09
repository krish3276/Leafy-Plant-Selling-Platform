import express from 'express';
import multer from 'multer';
import { chat, analyzeImage } from '../controllers/chatController.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/chat
// Body: { messages: [{ role: 'user' | 'assistant', content: string }] }
// Returns: Server-Sent Events stream of { text } chunks, terminated by [DONE]
router.post('/', chat);

// POST /api/chat/analyze-image
// FormData: { image: File, message?: string }
// Returns: JSON diagnosis from Gemini (no streaming)
router.post('/analyze-image', upload.single('image'), analyzeImage);

export default router;
