import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShieldAlert, Edit, LogOut, Shield } from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Shield size={24} />
          <span>SecureApp</span>
        </div>

        <ul className="nav-menu">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
          </li>
          
          {(user?.role === 'admin' || user?.role === 'editor') && (
            <li>
              <NavLink to="/editor" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Edit size={20} />
                Editor Panel
              </NavLink>
            </li>
          )}
          
          {user?.role === 'admin' && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <ShieldAlert size={20} />
                Admin Panel
              </NavLink>
            </li>
          )}
        </ul>

        <div className="user-profile">
          <div className="user-info">
            <div className="avatar">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username}</span>
              <span className={`user-role badge badge-${user?.role}`}>{user?.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn" style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
