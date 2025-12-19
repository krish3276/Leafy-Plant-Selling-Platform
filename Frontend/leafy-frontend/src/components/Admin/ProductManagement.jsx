import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle } from 'lucide-react';
import './ProductManagement.css';
import ProductForm from './ProductForm';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `http://localhost:5000/api/admin/products?page=${page}&limit=10&search=${searchTerm}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to fetch products');
        return;
      }

      setProducts(data.products);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to delete product');
        return;
      }

      setSuccess('Product deleted successfully');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete Error:', err);
      setError('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setError('');
  };

  const handleFormSuccess = () => {
    setSuccess('Product saved successfully');
    fetchProducts();
    handleCloseForm();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="product-management">
      {/* Header */}
      <div className="product-mgmt-header">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="search-btn">Search</button>
        </div>

        <button
          className="add-product-btn"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✓ {success}</span>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Table */}
      <div className="product-table-container">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>
                          <span className={`stock-badge ${product.stock < 10 ? 'low' : product.stock < 30 ? 'medium' : 'high'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(product)}
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteProduct(product._id)}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-message">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductManagement;
