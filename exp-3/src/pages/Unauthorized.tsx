import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">
      <div className="card auth-card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', marginBottom: '1.5rem' }}>
           <ShieldAlert size={48} />
        </div>
        <h1 className="card-title" style={{ fontSize: '2rem' }}>Access Denied</h1>
        <p className="card-text" style={{ marginBottom: '2rem' }}>
          You do not have the necessary permissions to view this page. Please contact your system administrator if you believe this is an error.
        </p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    </div>
  );
};
