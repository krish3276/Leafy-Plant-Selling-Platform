import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌱 Leafy Backend API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/api/health',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n' + '═'.repeat(50));
  console.log('🚀 Leafy Backend Server Started!');
  console.log('═'.repeat(50));
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log('═'.repeat(50) + '\n');
});

/**
 * app.listen():
 * - Starts the HTTP server
 * - Listens for incoming requests on specified port
 * - Callback runs when server successfully starts
 * 
 * PORT:
 * - Uses PORT from .env file
 * - Falls back to 5000 if not set
 * - Common ports: 3000, 5000, 8000, 8080
 */

/**
 * 🎓 COMPLETE FLOW SUMMARY:
 * 
 * 1. CLIENT MAKES REQUEST:
 *    Frontend: fetch('http://localhost:5000/api/auth/login', {...})
 * 
 * 2. REQUEST ARRIVES AT SERVER:
 *    → CORS middleware (checks origin)
 *    → JSON parser (parses body)
 *    → Logger middleware (logs request)
 * 
 * 3. ROUTING:
 *    → Express matches route: POST /api/auth/login
 *    → Runs route middleware: loginValidation
 *    → If validation passes, runs controller: login
 * 
 * 4. CONTROLLER PROCESSES:
 *    → Queries database
 *    → Performs business logic
 *    → Prepares response
 * 
 * 5. RESPONSE SENT:
 *    → res.json() sends JSON back to client
 *    → Express adds headers
 *    → Frontend receives response
 * 
 * 
 * 🔄 REQUEST LIFECYCLE:
 * 
 * Browser → HTTP Request → Express Server
 *                              ↓
 *                          Middleware
 *                              ↓
 *                           Routing
 *                              ↓
 *                          Validation
 *                              ↓
 *                         Controller
 *                              ↓
 *                          Database
 *                              ↓
 *                          Response
 *                              ↓
 * Browser ← JSON Response ← Express Server
 * 
 * 
 * 🎯 KEY CONCEPTS RECAP:
 * 
 * 1. EXPRESS = Web framework
 * 2. MIDDLEWARE = Functions that process requests
 * 3. ROUTES = URL endpoints that map to controllers
 * 4. CONTROLLERS = Business logic handlers
 * 5. MODELS = Database schemas
 * 6. CORS = Allow cross-origin requests
 * 7. JWT = Secure authentication tokens
 * 8. ASYNC/AWAIT = Handle asynchronous operations
 * 9. TRY-CATCH = Error handling
 * 10. ENV VARIABLES = Configuration and secrets
 */
