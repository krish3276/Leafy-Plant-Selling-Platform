import React from 'react';
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  AlertTriangle,
  Settings,
  LogOut,
  Bell,
  Mail,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

function AdminSidebar({ activeTab, setActiveTab, sidebarOpen, user }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      icon: <BarChart3 size={20} />,
      label: 'Dashboard',
    },
    {
      id: 'products',
      icon: <Package size={20} />,
      label: 'Products',
    },
    {
      id: 'orders',
      icon: <ShoppingCart size={20} />,
      label: 'Orders',
    },
    {
      id: 'users',
      icon: <Users size={20} />,
      label: 'Users',
    },
    {
      id: 'notifications',
      icon: <Bell size={20} />,
      label: 'Notifications',
    },
    {
      id: 'contacts',
      icon: <Mail size={20} />,
      label: 'Contact Messages',
    },
    {
      id: 'settings',
      icon: <Settings size={20} />,
      label: 'Settings',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div className="admin-logo-icon">🌱</div>
        <span className="admin-logo-text">Leafy Admin</span>
      </div>

      {/* Menu Items */}
      <nav className="admin-sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`admin-menu-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="admin-menu-icon">{item.icon}</span>
            <span className="admin-menu-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
