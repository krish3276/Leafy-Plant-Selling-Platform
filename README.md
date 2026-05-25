<div align="center">

# 🌿 Leafy

### *Your Plants. Your Garden. Your AI.*

**A full-stack plant e-commerce platform with AI-powered plant care, built on the MERN stack.**

---

![Node.js](https://img.shields.io/badge/Node.js-v24-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-02042B?style=for-the-badge&logo=razorpay&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Environment Setup](#️-environment-setup)
- [🚀 Getting Started](#-getting-started)
- [🌐 API Reference](#-api-reference)
- [📸 Usage & Screenshots](#-usage--screenshots)
- [💳 Payment Testing](#-payment-testing)
- [🔐 Admin Access](#-admin-access)
- [🤖 AI Features](#-ai-features)
- [☁️ Cloudinary Image Uploads](#️-cloudinary-image-uploads)
- [📦 Scripts Reference](#-scripts-reference)
- [🙌 Author](#-author)

---

## ✨ Features

### 🛍️ E-Commerce Core
- Browse plants by category: **Indoor**, **Outdoor**, **Succulents**, **Accessories**
- Full product detail pages with stock management
- Persistent shopping cart synced to MongoDB
- Wishlist management per user account

### 💳 Payments
- **Razorpay** integration with HMAC signature verification
- **Cash on Delivery** (COD) support
- Test-mode cards shown in checkout UI
- Order confirmation page with unique order numbers (`LF250525...`)

### 👤 Authentication
- JWT-based signup & login
- Google OAuth sign-in (via backend credential verification)
- Password hashing with **bcryptjs** (salt rounds: 10)
- Role-based access control: `customer` | `admin`

### 🤖 AI Plant Care (Powered by Google Gemini)
- Streaming AI chat for plant advice (Server-Sent Events)
- **Image diagnosis** — upload a photo of your plant and get an instant diagnosis
- Multi-turn conversation with context history

### 🌱 My Garden
- Personal garden tracker per user
- Log watering, fertilising, and other care activities
- Add notes to each plant
- Move wishlist items directly into garden

### 🛠️ Admin Dashboard
- Dashboard stats: users, revenue, products, orders
- Full **product management** (CRUD + Cloudinary image upload)
- **Order management** with status updates (`pending → confirmed → shipped → delivered`)
- **User management**: role updates, account deactivation
- **Notification centre** with read/delete and real-time polling
- Admin profile & password management
- Contact message inbox

### 📬 Other
- Contact form with DB persistence
- Notification preferences (per-type, global quiet hours, DND)
- Fully responsive — mobile-first design

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Lucide Icons |
| **Backend** | Node.js, Express 4, ES Modules |
| **Database** | MongoDB Atlas via Mongoose 8 |
| **Auth** | JWT (`jsonwebtoken`), bcryptjs, Google OAuth (`google-auth-library`) |
| **Payments** | Razorpay (HMAC-SHA256 verification) |
| **AI** | Google Gemini (`@google/generative-ai`) — streaming + vision |
| **Storage** | Cloudinary (image upload/delete via `multer-storage-cloudinary`) |
| **Validation** | `express-validator` |

---

## 📁 Project Structure

```
Leafy-Plant-Selling-Platform/
├── Backend/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary + multer config
│   │   ├── database.js         # MongoDB connection
│   │   └── razorpay.js         # Razorpay instance
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── chatController.js   # Gemini AI (stream + vision)
│   │   ├── contactController.js
│   │   ├── gardenController.js
│   │   ├── notificationController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── productController.js
│   ├── middleware/
│   │   ├── auth.js             # protect + adminOnly
│   │   └── validation.js       # express-validator rules
│   ├── models/
│   │   ├── ContactMessage.js
│   │   ├── GardenPlant.js
│   │   ├── Notification.js
│   │   ├── NotificationPreferences.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── gardenRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── productRoutes.js
│   ├── scripts/
│   │   ├── seedAdmin.js        # Creates default admin account
│   │   └── seedProducts.js     # Seeds plant product catalogue
│   ├── utils/
│   │   ├── cloudinaryHelper.js
│   │   └── notificationHelper.js
│   ├── .env                    # (not committed)
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── Frontend/leafy-frontend/
│   └── src/
│       ├── components/
│       │   ├── Admin/          # Dashboard sub-components
│       │   ├── Hero.jsx
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── FeaturedCategories.jsx
│       │   ├── PopularPicks.jsx
│       │   └── ImageUploader.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Shop.jsx
│       │   ├── ProductDetail.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── OrderConfirmation.jsx
│       │   ├── PlantCare.jsx   # AI chat + My Garden
│       │   ├── Account.jsx
│       │   ├── Login.jsx
│       │   ├── SignUp.jsx
│       │   ├── About.jsx
│       │   ├── Contact.jsx
│       │   ├── FAQs.jsx
│       │   └── AdminDashboard.jsx
│       ├── utils/
│       │   ├── api.js          # Centralised API calls
│       │   └── razorpay.js     # Razorpay modal launcher
│       ├── styles/             # Per-page CSS files
│       ├── imgs/               # Local static images
│       ├── App.jsx
│       └── main.jsx
│
├── Docs/                       # Developer documentation
├── README.md
└── package.json                # Workspace root
```

---

## ⚙️ Environment Setup

### Backend — `Backend/.env`

Create this file (use `Backend/.env.example` as reference):

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/leafy

# Auth
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Razorpay (use TEST keys for development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend — `Frontend/leafy-frontend/.env`

```env
# Google OAuth (optional — app works without it)
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB Atlas account (or local MongoDB)
- Razorpay test account
- Google Gemini API key
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Leafy-Plant-Selling-Platform.git
cd Leafy-Plant-Selling-Platform
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd Backend && npm install

# Install frontend dependencies
cd ../Frontend/leafy-frontend && npm install
```

### 3. Configure environment variables

```bash
cp Backend/.env.example Backend/.env
# Fill in all values in Backend/.env
```

### 4. Seed the database

```bash
cd Backend

# Create the admin account
npm run seed:admin

# Seed the product catalogue (~20 plants)
npm run seed:products
```

### 5. Run the application

Open **two terminals**:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd Backend
npm start

# Terminal 2 — Frontend (http://localhost:5173)
cd Frontend/leafy-frontend
npm run dev
```

> ✅ Backend: `http://localhost:5000`
> ✅ Frontend: `http://localhost:5173`

---

## 🌐 API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | Public | Register new user |
| `POST` | `/login` | Public | Login, returns JWT |
| `GET` | `/profile` | 🔒 User | Get current user profile |
| `PUT` | `/profile` | 🔒 User | Update profile |
| `POST` | `/wishlist/:productId` | 🔒 User | Toggle product in wishlist |
| `POST` | `/google` | Public | Google OAuth login |

### Products — `/api/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Public | Get all products (supports `?category=`) |
| `GET` | `/:id` | Public | Get single product |

### Cart — `/api/cart`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | 🔒 User | Get cart |
| `POST` | `/add` | 🔒 User | Add item |
| `PUT` | `/update` | 🔒 User | Update item quantity |
| `DELETE` | `/remove/:productId` | 🔒 User | Remove item |
| `DELETE` | `/clear` | 🔒 User | Clear cart |

### Orders — `/api/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | 🔒 User | Place order (COD) |
| `GET` | `/my-orders` | 🔒 User | My order history |
| `GET` | `/:id` | 🔒 User | Order detail |
| `GET` | `/:id/track` | 🔒 User | Track order status |
| `PUT` | `/:id/cancel` | 🔒 User | Cancel order |
| `GET` | `/admin/all` | 🔒 Admin | All orders |
| `PUT` | `/admin/:id/status` | 🔒 Admin | Update order status |

### Payments — `/api/payment`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/key` | 🔒 User | Get Razorpay key ID |
| `POST` | `/create-order` | 🔒 User | Create Razorpay order |
| `POST` | `/verify` | 🔒 User | Verify HMAC + save order |

### Garden — `/api/garden`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | 🔒 User | Get all garden plants |
| `POST` | `/` | 🔒 User | Add plant manually |
| `POST` | `/from-wishlist/:productId` | 🔒 User | Move from wishlist |
| `PUT` | `/:id` | 🔒 User | Update plant details |
| `POST` | `/:id/care` | 🔒 User | Log care activity |
| `POST` | `/:id/notes` | 🔒 User | Add note |
| `DELETE` | `/:id` | 🔒 User | Remove plant |

### AI Chat — `/api/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | Public | Streaming chat (SSE) |
| `POST` | `/analyze-image` | Public | Image diagnosis (multipart) |

### Admin — `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/dashboard` | 🔒 Admin | Dashboard stats |
| `GET/POST` | `/products` | 🔒 Admin | List / Create product |
| `PUT/DELETE` | `/products/:id` | 🔒 Admin | Update / Delete product |
| `POST` | `/upload-image` | 🔒 Admin | Upload image to Cloudinary |
| `GET` | `/users` | 🔒 Admin | All users |
| `PUT` | `/users/:id/role` | 🔒 Admin | Update user role |
| `PUT` | `/users/:id/deactivate` | 🔒 Admin | Deactivate user |
| `GET` | `/stats/users` | 🔒 Admin | User statistics |
| `GET` | `/stats/orders` | 🔒 Admin | Order statistics |

### Health

```
GET /api/health   →  { success: true, uptime, timestamp }
GET /            →  { success: true, message: "🌱 Leafy Backend API is running!" }
```

---

## 📸 Usage & Screenshots

---

### 1. Home Page — Hero & Featured Categories

![Leafy Home Page](Docs/screenshots/home-hero.png)

---

### 2. Shop Page — Product Grid

![Leafy Shop Page](Docs/screenshots/shop-grid.png)

---

### 3. Product Detail Page

![Product Detail](Docs/screenshots/product-detail.png)

---

### 4. Shopping Cart

![Shopping Cart](Docs/screenshots/cart.png)

---

### 5. Checkout — Razorpay Payment

![Checkout Page](Docs/screenshots/checkout.png)

![Razorpay Modal](Docs/screenshots/razorpay-modal.png)

---

### 6. Order Confirmation

![Order Confirmation](Docs/screenshots/order-confirmation.png)

---

### 7. AI Plant Care Chat

![AI Plant Care Chat](Docs/screenshots/ai-chat.png)

---

### 8. AI Image Diagnosis

![AI Image Diagnosis](Docs/screenshots/ai-image-diagnosis.png)

---

### 9. My Garden Tracker

![My Garden](Docs/screenshots/my-garden.png)

---

### 10. Account Page — Order History

![Order History](Docs/screenshots/account-orders.png)

---

### 11. Admin Dashboard — Overview

![Admin Dashboard](Docs/screenshots/admin-dashboard.png)

---

### 12. Admin — Product Management

![Admin Product Management](Docs/screenshots/admin-products.png)

---

### 13. Admin — Order Management

![Admin Order Management](Docs/screenshots/admin-orders.png)

---

## 💳 Payment Testing

Leafy uses **Razorpay in test mode**. Use these cards in the Razorpay modal:

| Scenario | Card Number | CVV | Expiry | OTP |
|----------|-------------|-----|--------|-----|
| ✅ Success | `4111 1111 1111 1111` | `123` | `12/28` | `1234` |
| 🌍 International | `5267 3181 8797 5449` | `123` | `12/28` | `1234` |

> These cards are also displayed directly on the Checkout page UI for convenience.

---

## 🔐 Admin Access

After running `npm run seed:admin`:

| Field | Value |
|-------|-------|
| **Email** | `admin@leafy.com` |
| **Password** | `Admin@123` |
| **Route** | `/admin/dashboard` |

> The admin dashboard is accessible at `/admin/dashboard` and requires an active admin JWT. Logging in via `/login` with admin credentials will auto-redirect there.

---

## 🤖 AI Features

Leafy uses **Google Gemini** for two AI capabilities:

### 1. Streaming Chat
- Endpoint: `POST /api/chat`
- Delivers responses as **Server-Sent Events (SSE)**
- Each chunk: `data: {"text": "..."}`
- Stream ends with: `data: [DONE]`
- Supports full conversation history for context

### 2. Plant Image Diagnosis
- Endpoint: `POST /api/chat/analyze-image`
- Accepts `multipart/form-data` with an `image` field
- Uses Gemini's **vision model** to analyse the uploaded plant photo
- Returns JSON diagnosis with possible conditions and care recommendations

---

## ☁️ Cloudinary Image Uploads

Product images are stored on **Cloudinary**.

- Admin uploads via `POST /api/admin/upload-image` (multipart form)
- Images auto-tagged and stored in Cloudinary's `leafy/products` folder
- Old images are deleted from Cloudinary when a product image is replaced
- `cloudinaryHelper.js` handles deletion by extracting the `public_id` from URLs

---

## 📦 Scripts Reference

### Backend

```bash
npm start           # Production server (node server.js)
npm run dev         # Development server with nodemon
npm run seed:admin  # Create default admin account
npm run seed:products # Seed plant catalogue to MongoDB
```

### Frontend

```bash
npm run dev         # Vite dev server (http://localhost:5173)
npm run build       # Production build
npm run preview     # Preview production build
```

---

## 🙌 Author

**Krish Sirsath**
**Maitri Soni**

> Built with 🌱 passion for plants and clean code.

---

<div align="center">

*Made with Node.js · React · MongoDB · Google Gemini · Razorpay*

</div>
