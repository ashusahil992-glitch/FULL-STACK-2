import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User as UserIcon } from 'lucide-react';
import api from '../api/axios';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const testApiCall = async () => {
    try {
      // This will trigger the request interceptor and attach the token
      await api.get('/some-protected-endpoint').catch(() => console.log('Mock request intercepted'));
      alert("API request simulated. Check console to see if token was attached (if backend existed).");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.username}!</p>
      </div>

      <div className="content-grid">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}>
               <UserIcon size={24} />
            </div>
            <div>
              <h2 className="card-title" style={{ marginBottom: 0 }}>Your Profile</h2>
            </div>
          </div>
          <div className="card-text">
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Role:</strong> <span className={`badge badge-${user?.role}`}>{user?.role}</span></p>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
               <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="card-title" style={{ marginBottom: 0 }}>Security</h2>
            </div>
          </div>
          <div className="card-text">
            <p>Your session is secured with a simulated JWT.</p>
            <button className="btn btn-primary" onClick={testApiCall} style={{ marginTop: '1rem' }}>
              Test Secure API Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
