import React, { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import '../styles/ImageUploader.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * ImageUploader Component
 * Handles image uploads to Cloudinary for product images
 *
 * Props:
 *   - onImageUpload: (imageUrl) => void - Callback when image is successfully uploaded
 *   - initialImage: string - Initial image URL to display
 *   - productId: string - Product ID for updating existing product image
 *   - token: string - Authorization token
 */
const ImageUploader = ({ onImageUpload, initialImage = '', productId, token }) => {
  const [imagePreview, setImagePreview] = useState(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const uploadImage = async (file) => {
    // Validate file
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedMimes.includes(file.type)) {
      setError('Only JPEG, PNG, GIF, and WebP images are allowed');
      return;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      let url;
      let method = 'POST';

      // If updating existing product, use the update endpoint
      if (productId) {
        url = `${API_BASE_URL}/admin/products/${productId}/upload-image`;
        method = 'PUT';
      } else {
        url = `${API_BASE_URL}/admin/upload-image`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.imageUrl;
        setImagePreview(imageUrl);
        setSuccess('Image uploaded successfully!');
        onImageUpload(imageUrl);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to upload image');
      }
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
      console.error('Image upload error:', err);
    } finally {
      setIsLoading(false);
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadImage(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      uploadImage(files[0]);
    }
  };

  const clearImage = () => {
    const resetToDefault = 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400';

    if (productId) {
      fetch(`${API_BASE_URL}/admin/products/${productId}/image`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setImagePreview(data.product?.image || resetToDefault);
            onImageUpload(data.product?.image || resetToDefault);
            setSuccess('Image removed successfully');
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setError(data.message || 'Failed to remove image');
          }
        })
        .catch((err) => {
          setError(`Remove failed: ${err.message}`);
        });
      return;
    }

    setImagePreview('');
    onImageUpload('');
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {imagePreview ? (
          <div className="image-preview-container">
            <img
              src={imagePreview}
              alt="Product preview"
              className="image-preview"
            />
            <div className="preview-actions">
              {isLoading ? (
                <button className="btn-loading" disabled>
                  <Loader size={18} /> Uploading...
                </button>
              ) : (
                <>
                  <label className="btn-upload">
                    <Upload size={18} /> Change Image
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button className="btn-delete" onClick={clearImage}>
                    <X size={18} /> Remove
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            {isLoading ? (
              <div className="loading">
                <Loader size={32} className="spinner" />
                <p>Uploading image...</p>
              </div>
            ) : (
              <>
                <Upload size={48} />
                <p>Drag and drop your image here</p>
                <p className="or">or</p>
                <label className="btn-browse">
                  Browse Files
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    style={{ display: 'none' }}
                  />
                </label>
                <p className="file-info">
                  Supported formats: JPEG, PNG, GIF, WebP (Max 10MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
    </div>
  );
};

export default ImageUploader;
