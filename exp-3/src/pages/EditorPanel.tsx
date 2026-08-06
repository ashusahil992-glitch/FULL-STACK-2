import React from 'react';
import { Edit3, FileText, Settings } from 'lucide-react';

export const EditorPanel: React.FC = () => {
  return (
    <div>
      <div className="dashboard-header">
        <h1 className="page-title" style={{ color: 'var(--success-color)' }}>Editor Panel</h1>
        <p className="page-subtitle">Content Management Area</p>
      </div>

      <div className="card" style={{ borderTop: '4px solid var(--success-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
             <Edit3 size={32} />
          </div>
          <div>
            <h2 className="card-title" style={{ marginBottom: 0 }}>Content Tools</h2>
            <p className="card-text">Accessible to users with <strong>admin</strong> or <strong>editor</strong> roles.</p>
          </div>
        </div>
        
        <div className="content-grid" style={{ marginTop: '2rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} className="hover-effect">
            <FileText size={32} color="var(--primary-color)" />
            <span style={{ fontWeight: 500 }}>Create New Post</span>
          </div>
          
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} className="hover-effect">
            <Settings size={32} color="var(--text-secondary)" />
            <span style={{ fontWeight: 500 }}>Manage Categories</span>
          </div>
        </div>
      </div>
    </div>
  );
};
