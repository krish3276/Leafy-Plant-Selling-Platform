/**
 * API Service Utility
 * Centralized API calls for the application
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with optional auth
const createHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// ==================== PRODUCT APIs ====================

export const productAPI = {
  // Get all products (user view - only active products)
  getAllProducts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.sort) queryParams.append('sort', filters.sort);

    const url = `${API_BASE_URL}/products${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  },

  // Get single product by ID
  getProductById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return await response.json();
  },
};

// ==================== ADMIN APIs ====================

export const adminAPI = {
  // Get dashboard stats
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard');
    }

    return await response.json();
  },

  // Get all products (admin view - includes inactive)
  getAllProducts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const url = `${API_BASE_URL}/admin/products${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  },

  // Create product
  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create product');
    }

    return await response.json();
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }

    return await response.json();
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    return await response.json();
  },

  // Get all users
  getAllUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.role) queryParams.append('role', filters.role);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const url = `${API_BASE_URL}/admin/users${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return await response.json();
  },

  // Update user role
  updateUserRole: async (id, role) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user role');
    }

    return await response.json();
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return await response.json();
  },
};

// ==================== AUTH APIs ====================

export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  },

  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return await response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json();
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return await response.json();
  },
};

// ==================== CART APIs ====================

export const cartAPI = {
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    return await response.json();
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add to cart');
    }

    return await response.json();
  },

  updateCartItem: async (productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }

    return await response.json();
  },

  removeFromCart: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to remove from cart');
    }

    return await response.json();
  },

  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    return await response.json();
  },
};

export default {
  productAPI,
  adminAPI,
  authAPI,
  cartAPI,
};
