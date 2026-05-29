import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import './ProductForm.css';
import ImageUploader from '../ImageUploader';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

function ProductForm({ product, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || 'indoor',
    stock: product?.stock || '',
    difficulty: product?.difficulty || 'medium',
    sunlight: product?.sunlight || 'medium',
    waterFrequency: product?.waterFrequency || 'Once a week',
    size: product?.size || '',
    toolType: product?.toolType || 'fertilizer',
    warranty: product?.warranty || '1 Year',
    image: product?.image || '',
    isActive: product?.isActive !== false,
  });

  const isAccessoryCategory = formData.category === 'accessories';

  const token = localStorage.getItem('authToken');

  const handleImageUpload = (imageUrl) => {
    setFormData({
      ...formData,
      image: imageUrl,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { ...formData };

      if (payload.category === 'accessories') {
        delete payload.difficulty;
        delete payload.sunlight;
        delete payload.waterFrequency;
        delete payload.size;
      } else {
        delete payload.toolType;
        delete payload.warranty;
      }

      const url = product
        ? `${API_BASE_URL}/admin/products/${product._id}`
        : `${API_BASE_URL}/admin/products`;

      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to save product');
        return;
      }

      onSuccess();
    } catch (err) {
      console.error('Error:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-modal">
      <div className="product-form-overlay" onClick={onClose}></div>

      <div className="product-form-container">
        <div className="form-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Peace Lily"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the product..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="succulents">Succulents</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          {!isAccessoryCategory && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty Level</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sunlight">Sunlight Requirement</label>
                <select
                  id="sunlight"
                  name="sunlight"
                  value={formData.sunlight}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          )}

          {!isAccessoryCategory && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="waterFrequency">Watering Frequency</label>
                <input
                  type="text"
                  id="waterFrequency"
                  name="waterFrequency"
                  value={formData.waterFrequency}
                  onChange={handleChange}
                  placeholder="e.g., Once a week"
                />
              </div>

              <div className="form-group">
                <label htmlFor="size">Size</label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="e.g., Small, Medium, Large"
                />
              </div>
            </div>
          )}

          {isAccessoryCategory && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="toolType">Tool Type *</label>
                <select
                  id="toolType"
                  name="toolType"
                  value={formData.toolType}
                  onChange={handleChange}
                  required
                >
                  <option value="watering-can">Watering Can</option>
                  <option value="pruning-shears">Pruning Shears</option>
                  <option value="soil-mix">Soil Mix</option>
                  <option value="pot">Pot</option>
                  <option value="planter">Planter</option>
                  <option value="stand">Stand</option>
                  <option value="trellis">Trellis</option>
                  <option value="mister">Mister</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="gloves">Gloves</option>
                  <option value="spade">Spade</option>
                  <option value="rake">Rake</option>
                  <option value="light">Light</option>
                  <option value="thermometer">Thermometer</option>
                  <option value="moisture-meter">Moisture Meter</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="warranty">Warranty *</label>
                <input
                  type="text"
                  id="warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 1 Year"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Product Image</label>
            <ImageUploader
              onImageUpload={handleImageUpload}
              initialImage={formData.image}
              productId={product?._id}
              token={token}
            />
          </div>

          <div className="form-group checkbox">
            <label htmlFor="isActive">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Active Product
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : (product ? 'Update' : 'Create')} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
