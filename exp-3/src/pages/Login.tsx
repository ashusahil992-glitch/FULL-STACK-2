import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', marginBottom: '1rem' }}>
             <LogIn size={32} />
          </div>
          <h1 className="card-title">Welcome Back</h1>
          <p className="card-text">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin, editor, or viewer"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (e.g., password123)"
              disabled={isLoading}
            />
            {error && <p className="error-message">{error}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading || !username}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          <p>Demo Accounts (Password: <strong>password123</strong>):</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <span className="badge badge-admin">admin</span>
            <span className="badge badge-editor">editor</span>
            <span className="badge">viewer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
