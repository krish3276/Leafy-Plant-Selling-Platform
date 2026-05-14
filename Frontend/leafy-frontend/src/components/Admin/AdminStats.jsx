import React from 'react';
import {
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import './AdminStats.css';

function AdminStats({ dashboardData, setActiveTab, setUserRoleFilter }) {
  const { stats, lowStockProducts, recentProducts } = dashboardData;

  const handleCardClick = (tab, role, productId) => {
    if (typeof setUserRoleFilter === 'function') {
      setUserRoleFilter(role || '');
    }
    if (typeof setProductFilterId === 'function') {
      setProductFilterId(productId || '');
    }
    if (typeof setActiveTab === 'function') setActiveTab(tab);
  };

  return (
    <div className="admin-stats-container">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div
          className="stat-card clickable-card"
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick('products')}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick('products')}
        >
          <div className="stat-icon products-icon">
            <Package size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h3 className="stat-value">{stats.totalProducts}</h3>
          </div>
        </div>

        <div
          className="stat-card clickable-card"
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick('users')}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick('users')}
        >
          <div className="stat-icon users-icon">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Customers</p>
            <h3 className="stat-value">{stats.totalUsers}</h3>
          </div>
        </div>

        <div
          className="stat-card clickable-card"
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick('users', 'admin')}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick('users', 'admin')}
        >
          <div className="stat-icon admins-icon">
            <TrendingUp size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Admins</p>
            <h3 className="stat-value">{stats.totalAdmins}</h3>
          </div>
        </div>

        <div
          className="stat-card clickable-card"
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick('products')}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick('products')}
        >
          <div className="stat-icon warning-icon">
            <AlertTriangle size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Low Stock Items</p>
            <h3 className="stat-value">{stats.lowStockCount}</h3>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="admin-tables-section">
        {/* Low Stock Products */}
        <div className="admin-table-card">
          <div className="table-header">
            <h2 className="table-title">⚠️ Low Stock Products</h2>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts && lowStockProducts.length > 0 ? (
                  lowStockProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="clickable-row"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCardClick('products', null, product._id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCardClick('products', null, product._id)}
                    >
                      <td className="product-name">{product.name}</td>
                      <td>{product.category}</td>
                      <td>
                        <span className="stock-badge low">{product.stock}</span>
                      </td>
                      <td>${product.price.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-message">
                      No low stock products
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Products */}
        <div className="admin-table-card">
          <div className="table-header">
            <h2 className="table-title">📦 Recent Products</h2>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts && recentProducts.length > 0 ? (
                  recentProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="clickable-row"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCardClick('products', null, product._id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCardClick('products', null, product._id)}
                    >
                      <td className="product-name">{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-message">
                      No products yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
