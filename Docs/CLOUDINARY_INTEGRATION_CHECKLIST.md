# Cloudinary Setup - Complete Integration Checklist

## ✅ Backend Setup (Already Completed)

- [x] Installed Cloudinary packages: `cloudinary`, `multer-storage-cloudinary`
- [x] Created `Backend/config/cloudinary.js` - Cloudinary configuration
- [x] Created `Backend/utils/cloudinaryHelper.js` - Helper functions for upload/delete
- [x] Created `Backend/controllers/uploadController.js` - Image upload endpoints
- [x] Updated `Backend/routes/adminRoutes.js` - Added image upload routes

### New Backend Routes Available

```
POST   /api/admin/upload-image           - Upload image (get URL only)
PUT    /api/admin/products/:id/upload-image - Update product with image
DELETE /api/admin/products/:id/image      - Delete product image
```

---

## 📋 TODO - Backend Configuration

### Step 1: Create Cloudinary Account
- [ ] Go to https://cloudinary.com
- [ ] Sign up for free account
- [ ] Verify email and log in
- [ ] Go to Dashboard

### Step 2: Get Cloudinary Credentials
From Dashboard, note down:
- [ ] **Cloud Name** - Copy this
- [ ] **API Key** - Copy this  
- [ ] **API Secret** - Copy this (keep confidential!)

### Step 3: Update Backend .env File

Create or edit `Backend/.env` and add:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration (ADD THESE)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Google Gemini (if using AI features)
GEMINI_API_KEY=your_gemini_key_here
```

### Step 4: Restart Backend Server

```bash
cd Backend
npm run dev
```

**Expected Output:**
```
🌱 Leafy Backend API is running!
MongoDB Connected
Server running on port 8000
```

---

## 🎨 TODO - Frontend Setup

### Step 1: Copy ImageUploader Component

Files already created:
- [x] `Frontend/leafy-frontend/src/components/ImageUploader.jsx`
- [x] `Frontend/leafy-frontend/src/styles/ImageUploader.css`

### Step 2: Integrate into Product Forms

#### Option A: Admin Create Product Page
File: `Frontend/leafy-frontend/src/pages/AdminDashboard.jsx` (or create product form)

```jsx
import ImageUploader from '../components/ImageUploader';

// In your component:
const [productData, setProductData] = useState({ image: '' });
const token = localStorage.getItem('token');

const handleImageUpload = (imageUrl) => {
  setProductData({ ...productData, image: imageUrl });
};

// In JSX:
<ImageUploader
  onImageUpload={handleImageUpload}
  token={token}
/>
```

#### Option B: Admin Edit Product Page
```jsx
<ImageUploader
  onImageUpload={handleImageUpload}
  initialImage={product?.image}
  productId={product?._id}
  token={token}
/>
```

### Step 3: Update Product API Call

When creating/updating product:

```javascript
const response = await fetch('/api/admin/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ...productData,
    image: productData.image, // This comes from ImageUploader
  }),
});
```

### Step 4: Update Product Listing

Products now display with Cloudinary URLs:
```jsx
<img src={product.image} alt={product.name} />
```

---

## 🧪 Testing Checklist

### Backend Testing

- [ ] Start backend: `npm run dev` (from Backend folder)
- [ ] Test health endpoint: `GET http://localhost:8000/api/health`
- [ ] Verify Cloudinary config loaded (no errors about missing env vars)

### Frontend Testing

- [ ] Start frontend: `npm run dev` (from Frontend/leafy-frontend folder)
- [ ] Navigate to admin product creation page
- [ ] Test image upload with drag-and-drop
- [ ] Test image upload with file browser
- [ ] Verify image preview appears
- [ ] Verify image URL is saved in product
- [ ] Check Cloudinary Dashboard to see uploaded images

### API Testing

Using curl or Postman:

```bash
# Test upload endpoint
curl -X POST http://localhost:8000/api/admin/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"

# Expected response:
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/...",
  "fileName": "..."
}
```

---

## 📊 Verification Steps

### Verify Cloudinary Integration

1. **In Cloudinary Dashboard**:
   - [ ] Go to Media Library
   - [ ] Should see images under `leafy-plants` folder
   - [ ] Check image URLs match product images

2. **In Database**:
   - [ ] Product documents should have Cloudinary URLs in `image` field
   - [ ] Example: `https://res.cloudinary.com/dm7qzxs3w/image/upload/...`

3. **In Frontend**:
   - [ ] Product images load correctly
   - [ ] Image preview shows in ImageUploader component
   - [ ] No broken image links (404s)

---

## 🔍 Troubleshooting

### Problem: "CLOUDINARY_CLOUD_NAME is undefined"
```
Solution: 
1. Check .env file in Backend folder has all 3 variables
2. Restart backend server (npm run dev)
3. No spaces around = in .env file
```

### Problem: "401 Unauthorized" on upload
```
Solution:
1. Verify token is valid and not expired
2. Check Authorization header: "Bearer YOUR_TOKEN"
3. Ensure user is logged in as admin
```

### Problem: "Invalid file type"
```
Solution:
1. Only JPEG, PNG, GIF, WebP allowed
2. Convert image if in different format
3. Check file extension matches actual format
```

### Problem: "File too large"
```
Solution:
1. Maximum size is 10MB
2. Compress image before upload
3. Use online image compressor if needed
```

### Problem: Images not appearing in Cloudinary Dashboard
```
Solution:
1. Check Cloudinary credentials are correct
2. Verify API key and secret in .env match Dashboard
3. Check backend console for upload errors
4. Verify network request in browser DevTools
```

### Problem: CORS error when uploading
```
Solution:
1. Check CORS is configured in Backend/server.js
2. Frontend origin should be in allowed origins:
   - http://localhost:5173
   - http://localhost:5174
3. Restart backend after changing CORS
```

---

## 🚀 After Successful Setup

### Recommended Next Steps

1. **Update Existing Products**
   - [ ] Migrate old Unsplash URLs to Cloudinary
   - [ ] Create admin script to auto-upload product images
   
2. **Enhance Image Features**
   - [ ] Add image cropping functionality
   - [ ] Add multiple images per product
   - [ ] Add image optimization for mobile
   
3. **Monitor Usage**
   - [ ] Check Cloudinary dashboard monthly
   - [ ] Track storage and bandwidth usage
   - [ ] Set up automatic cleanup for unused images

4. **Production Setup**
   - [ ] Update CORS for production domain
   - [ ] Move .env to secure production server
   - [ ] Set up environment variables in hosting platform
   - [ ] Test full upload flow in production

---

## 📚 Documentation Links

- [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) - Cloudinary account setup & API reference
- [FRONTEND_IMAGE_UPLOAD_GUIDE.md](./FRONTEND_IMAGE_UPLOAD_GUIDE.md) - React component usage guide
- [Backend config/cloudinary.js](./Backend/config/cloudinary.js) - Cloudinary configuration
- [Backend controllers/uploadController.js](./Backend/controllers/uploadController.js) - Upload endpoints

---

## ✨ Features Implemented

✅ **Image Upload**
- Drag-and-drop interface
- File validation (format, size)
- Real-time preview
- Progress indication

✅ **Cloudinary Integration**
- Automatic image optimization
- Global CDN delivery
- Auto quality adjustment
- Secure file storage

✅ **Product Management**
- Upload new product images
- Update product images
- Delete product images
- Auto cleanup of old images

✅ **Security**
- JWT authentication required
- File type validation
- Size limits (10MB)
- Admin-only endpoints

---

## 📝 Notes

- All images stored in `leafy-plants` folder on Cloudinary
- Old images automatically deleted when updated
- Unsplash fallback used for products without images
- Images fully responsive and optimized for web
- Supports: JPEG, PNG, GIF, WebP formats

---

**Status**: ✅ Backend Setup Complete | ⏳ Awaiting Frontend Integration

**Next Action**: Follow the Frontend Setup section to complete integration.
