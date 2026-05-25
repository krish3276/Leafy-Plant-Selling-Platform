# Cloudinary Setup Guide

## 🚀 Quick Setup Steps

### 1. Create Cloudinary Account
- Go to [Cloudinary.com](https://cloudinary.com)
- Sign up for a free account (or use existing)
- Go to Dashboard to find your credentials

### 2. Get Cloudinary Credentials
In your Cloudinary Dashboard, you'll find:
- **Cloud Name** - Your unique cloud identifier
- **API Key** - Your public API key
- **API Secret** - Your private API secret (keep this confidential!)

### 3. Update Environment Variables

Add these to your `.env` file in the Backend folder:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dm7qzxs3w
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdef123456789
```

### 4. Restart Backend Server
```bash
cd Backend
npm run dev
```

---

## 📁 API Endpoints for Image Upload

### Upload Product Image (Get URL only)
```
POST /api/admin/upload-image
Headers:
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data

Body:
  - image: <file> (max 10MB, formats: jpg, jpeg, png, gif, webp)

Response:
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/...",
  "fileName": "1234567890-plant.jpg"
}
```

### Update Product with Image
```
PUT /api/admin/products/:id/upload-image
Headers:
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data

Body:
  - image: <file>

Response:
{
  "success": true,
  "message": "Product image updated successfully",
  "product": { ... },
  "imageUrl": "https://res.cloudinary.com/..."
}
```

### Delete Product Image (Reset to Default)
```
DELETE /api/admin/products/:id/image
Headers:
  - Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Product image deleted successfully",
  "product": { ... }
}
```

---

## 🎨 Features

✅ **Automatic Image Optimization**
- WebP format support
- Auto quality optimization
- Responsive image delivery

✅ **Security**
- File size limit: 10MB
- Allowed formats: JPEG, PNG, GIF, WebP
- All images stored in `leafy-plants` folder on Cloudinary
- Old images automatically deleted when updated

✅ **Performance**
- CDN delivery with global edge locations
- Automatic caching
- Fast upload speeds

---

## 🔧 Troubleshooting

### Issue: "CLOUDINARY_CLOUD_NAME is undefined"
**Solution:** Make sure you've added all three environment variables to `.env` and restarted the backend server.

### Issue: "Invalid file type"
**Solution:** Only JPEG, PNG, GIF, and WebP files are allowed. Convert your image format.

### Issue: "File too large"
**Solution:** Maximum file size is 10MB. Compress your image first.

### Issue: Images not appearing after upload
**Solution:** 
1. Check that the imageUrl is being saved in the database
2. Verify Cloudinary credentials are correct
3. Check browser console for any CORS errors

---

## 🌐 Frontend Integration

When uploading from frontend (React):

```javascript
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://localhost:8000/api/admin/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      return data.imageUrl; // Use this URL for product image
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

---

## 📊 Cloudinary Dashboard

After uploading images, you can:
- View all uploaded images in Media Library
- Get image statistics and usage
- Manage transformations and optimization
- Set up automated cleanup rules

Visit: https://cloudinary.com/console
