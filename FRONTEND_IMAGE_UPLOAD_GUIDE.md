# Cloudinary Image Upload - Frontend Integration Guide

## 📋 Overview

The `ImageUploader` component handles all image uploads to Cloudinary with:
- Drag-and-drop functionality
- File validation (format, size)
- Image preview
- Loading states
- Error handling
- Success notifications

## 🎯 Usage in Admin Product Form

### Basic Example - New Product

```jsx
import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';

function CreateProductPage() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '', // This will be set by ImageUploader
    category: '',
    stock: 0,
  });
  const [token] = useState(localStorage.getItem('token'));

  const handleImageUpload = (imageUrl) => {
    setProductData({
      ...productData,
      image: imageUrl,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send productData to backend
    const response = await fetch('http://localhost:8000/api/admin/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    if (data.success) {
      alert('Product created successfully!');
      // Redirect or reset form
    }
  };

  return (
    <div className="create-product">
      <h2>Create New Product</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Image</label>
          <ImageUploader
            onImageUpload={handleImageUpload}
            token={token}
          />
        </div>

        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: parseFloat(e.target.value) })
            }
            required
          />
        </div>

        {/* Other form fields... */}

        <button type="submit" className="btn-submit">
          Create Product
        </button>
      </form>
    </div>
  );
}

export default CreateProductPage;
```

### Update Product Example

```jsx
import { useState, useEffect } from 'react';
import ImageUploader from '../components/ImageUploader';

function EditProductPage({ productId }) {
  const [productData, setProductData] = useState(null);
  const [token] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch product details
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${productId}`
      );
      const data = await response.json();
      setProductData(data.product);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleImageUpload = (imageUrl) => {
    setProductData({
      ...productData,
      image: imageUrl,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `http://localhost:8000/api/admin/products/${productId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      }
    );

    const data = await response.json();
    if (data.success) {
      alert('Product updated successfully!');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-product">
      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Image</label>
          <ImageUploader
            onImageUpload={handleImageUpload}
            initialImage={productData?.image}
            productId={productId}
            token={token}
          />
        </div>

        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={productData?.name || ''}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
            required
          />
        </div>

        {/* Other form fields... */}

        <button type="submit" className="btn-submit">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default EditProductPage;
```

## 🔧 ImageUploader Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onImageUpload` | function | ✅ | Callback function that receives the image URL after successful upload |
| `token` | string | ✅ | JWT authentication token for API requests |
| `initialImage` | string | ❌ | Existing image URL to display in preview (for editing) |
| `productId` | string | ❌ | Product ID for updating existing product image |

## 📡 API Flow

### Upload Image Only (Get URL)
```
1. User selects/drags image
2. Frontend validates file (format, size)
3. FormData sent to: POST /api/admin/upload-image
4. Backend uploads to Cloudinary
5. Response contains imageUrl
6. Frontend callback: onImageUpload(imageUrl)
7. App uses URL for product.image field
```

### Update Product Image
```
1. User selects/drags image
2. Frontend validates file (format, size)
3. FormData + productId sent to: PUT /api/admin/products/:id/upload-image
4. Backend:
   - Deletes old image from Cloudinary
   - Uploads new image to Cloudinary
   - Updates product in database
5. Response contains updated product
6. Frontend callback: onImageUpload(imageUrl)
```

## 🎨 Customization

### Change Upload Area Appearance

Edit `ImageUploader.css`:

```css
.upload-area {
  border: 2px dashed #22c55e;  /* Change border color */
  background-color: #f0fdf4;   /* Change background */
}

.btn-browse {
  background-color: #22c55e;   /* Change button color */
}
```

### Change Allowed File Types

Edit `ImageUploader.jsx` - Modify `allowedMimes`:

```javascript
const allowedMimes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml', // Add SVG if needed
];
```

### Change File Size Limit

Edit `ImageUploader.jsx`:

```javascript
const maxSize = 20 * 1024 * 1024; // Change to 20MB
```

## ⚠️ Important Notes

1. **Token Required**: ImageUploader needs the JWT token for authentication
   ```javascript
   const token = localStorage.getItem('token');
   ```

2. **CORS**: Make sure backend CORS is configured to allow frontend origin

3. **Error Handling**: Component handles errors internally, but you can catch via callback

4. **Image URL Storage**: The returned `imageUrl` must be stored in your database
   ```javascript
   // This is important!
   const imageUrl = data.imageUrl;
   // Store in database when creating/updating product
   ```

## 🐛 Debugging

### Check Network Requests
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for the upload request
4. Check response status and body

### Common Issues

**Issue**: "400 Bad Request"
- **Check**: File format is allowed (JPEG, PNG, GIF, WebP)
- **Check**: File size is under 10MB

**Issue**: "401 Unauthorized"
- **Check**: Token is valid and not expired
- **Check**: Token is sent in Authorization header

**Issue**: "500 Internal Server Error"
- **Check**: Cloudinary credentials in .env are correct
- **Check**: Backend server is running
- **Check**: MongoDB connection is working

## 📱 Mobile Responsive

The component is fully responsive:
- Desktop: Large upload area with preview
- Tablet: Adjusted layout
- Mobile: Optimized for touch with stacked buttons

All handled automatically by the CSS media queries.

## 🚀 Advanced Usage

### Conditional Upload Based on Product Type

```jsx
<ImageUploader
  onImageUpload={handleImageUpload}
  initialImage={productData?.image}
  productId={productId}
  token={token}
  // Could add custom props for different upload limits per product type
/>
```

### Manual Upload Trigger

```jsx
// If you want more control over when upload happens
const fileInputRef = useRef();

const triggerUpload = () => {
  fileInputRef.current?.click();
};
```

## 📚 Related Files

- Component: `src/components/ImageUploader.jsx`
- Styles: `src/styles/ImageUploader.css`
- Backend Config: `Backend/config/cloudinary.js`
- Backend Routes: `Backend/routes/adminRoutes.js`
- Backend Controller: `Backend/controllers/uploadController.js`
