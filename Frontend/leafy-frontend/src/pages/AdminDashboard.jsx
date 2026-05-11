import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Package,
  LogOut,
  Menu,
  X,
  AlertCircle,
} from 'lucide-react';
import '../styles/AdminDashboard.css';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminStats from '../components/Admin/AdminStats';
import ProductManagement from '../components/Admin/ProductManagement';
import OrdersManagement from '../components/Admin/OrdersManagement';
import UserManagement from '../components/Admin/UserManagement';
import AdminSettings from '../components/Admin/AdminSettings';
import AdminNotifications from '../components/Admin/AdminNotifications';

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    setUser(parsedUser);
    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          navigate('/admin/login');
          return;
        }
        setError(data.message || 'Failed to load dashboard');
        return;
      }

      setDashboardData(data.dashboard);
      setError('');
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loader"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        user={user}
      />

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Top Bar */}
        <div className="admin-topbar">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="admin-topbar-right">
            <div className="admin-user-info">
              <div className="admin-user-avatar">{user?.firstName?.[0]}</div>
              <div className="admin-user-details">
                <p className="admin-user-name">{user?.firstName} {user?.lastName}</p>
                <p className="admin-user-role">Administrator</p>
              </div>
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          {/* Error Alert */}
          {error && (
            <div className="admin-error-alert">
              <AlertCircle size={20} />
              <span>{error}</span>
              <button onClick={() => setError('')}>×</button>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="admin-tab-content">
              <h1 className="admin-page-title">Dashboard</h1>
              {dashboardData && (
                <AdminStats dashboardData={dashboardData} />
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="admin-tab-content">
              <h1 className="admin-page-title">Product Management</h1>
              <ProductManagement />
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="admin-tab-content">
              <h1 className="admin-page-title">Order Management</h1>
              <OrdersManagement />
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="admin-tab-content">
              <h1 className="admin-page-title">User Management</h1>
              <UserManagement />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="admin-tab-content">
              <AdminSettings />
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="admin-tab-content">
              <AdminNotifications />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
