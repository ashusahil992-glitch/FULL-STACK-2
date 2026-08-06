import React from 'react';
import { ShieldAlert, Trash2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="page-title" style={{ color: 'var(--danger-color)' }}>Admin Panel</h1>
        <p className="page-subtitle">Restricted Access Area</p>
      </div>

      <div className="card" style={{ borderTop: '4px solid var(--danger-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}>
             <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="card-title" style={{ marginBottom: 0 }}>System Controls</h2>
            <p className="card-text">Only accessible to users with the <strong>admin</strong> role.</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-danger">
            <Trash2 size={18} />
            Delete All Users
          </button>
          <button className="btn" style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            <Users size={18} />
            Manage Roles
          </button>
        </div>
        
        {/* Conditional rendering example within a page */}
        {user?.role === 'admin' && (
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.5rem', border: '1px dashed var(--danger-color)' }}>
            <p style={{ color: 'var(--danger-color)', fontSize: '0.875rem', fontWeight: 600 }}>
              Super Secret Admin Data: System is running normally. No breaches detected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
