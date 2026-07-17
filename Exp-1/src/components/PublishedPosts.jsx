import React, { useState } from 'react';

export default function PublishedPosts({ posts, onReusePost, onDeletePost }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDownloadTxt = (post) => {
    const element = document.createElement("a");
    const file = new Blob([post.text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `published-post-${post.id.slice(0, 8)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getPlatformIcon = (id) => {
    switch (id) {
      case 'twitter': return '🐦';
      case 'linkedin': return '💼';
      case 'facebook': return '👥';
      case 'instagram': return '📸';
      default: return '📎';
    }
  };

  return (
    <div className="saved-drafts-container glass-panel animate-fade-in">
      <style>{`
        .saved-drafts-container {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-height: 520px;
        }
        .drafts-title-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
        }
        .drafts-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .drafts-count {
          background: var(--accent-glow);
          color: var(--accent-primary);
          border: 1px solid var(--border-glass-active);
          padding: 2px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .drafts-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .draft-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all var(--transition-normal);
        }
        .draft-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.04);
        }
        .draft-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .draft-timestamp {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .draft-platforms {
          display: flex;
          gap: 4px;
        }
        .draft-platform-tag {
          font-size: 0.75rem;
          background: var(--bg-glass-hover);
          padding: 2px 6px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-glass);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .draft-body {
          color: var(--text-primary);
          font-size: 0.9rem;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.5;
          max-height: 120px;
          overflow-y: auto;
          background: rgba(0,0,0,0.15);
          padding: 10px;
          border-radius: var(--radius-sm);
        }
        .draft-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          border-top: 1px solid var(--border-glass);
          padding-top: 10px;
        }
        .draft-btn {
          background: transparent;
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          cursor: pointer;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-family: var(--font-heading);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all var(--transition-fast);
        }
        .draft-btn:hover {
          color: var(--text-primary);
          background: var(--bg-glass-hover);
          border-color: var(--border-glass-hover);
        }
        .draft-btn.delete-btn {
          border-color: rgba(244, 63, 94, 0.15);
          color: var(--color-danger);
        }
        .draft-btn.delete-btn:hover {
          background: rgba(244, 63, 94, 0.08);
          border-color: rgba(244, 63, 94, 0.35);
        }
        .draft-btn.success-btn {
          background: var(--color-success);
          color: white;
          border-color: var(--color-success);
        }
        .empty-drafts-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-muted);
          font-size: 0.9rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          border: 1px dashed var(--border-glass);
          border-radius: var(--radius-md);
          margin-top: 10px;
        }
      `}</style>

      <div className="drafts-title-bar">
        <span className="drafts-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          Published Posts
        </span>
        <span className="drafts-count">{posts.length} Posted</span>
      </div>

      {posts.length === 0 ? (
        <div className="empty-drafts-state">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <div>No posts published yet.</div>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Click "Publish Post" above to share content.</span>
        </div>
      ) : (
        <div className="drafts-list">
          {posts.map((post) => (
            <div key={post.id} className="draft-card">
              <div className="draft-meta">
                <span className="draft-timestamp">
                  {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' • '}
                  {new Date(post.timestamp).toLocaleDateString()}
                </span>
                <div className="draft-platforms">
                  {post.platforms.map((p) => (
                    <span key={p} className="draft-platform-tag" title={p}>
                      {getPlatformIcon(p)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="draft-body">{post.text}</div>

              <div className="draft-actions">
                <button
                  className="draft-btn"
                  onClick={() => onReusePost(post)}
                  title="Load text back into Composer to edit/reuse"
                >
                  Reuse
                </button>
                <button
                  className={`draft-btn ${copiedId === post.id ? 'success-btn' : ''}`}
                  onClick={() => handleCopyToClipboard(post.text, post.id)}
                  title="Copy Post Content"
                >
                  {copiedId === post.id ? 'Copied!' : 'Copy'}
                </button>
                <button
                  className="draft-btn"
                  onClick={() => handleDownloadTxt(post)}
                  title="Download as TXT file"
                >
                  TXT
                </button>
                <button
                  className="draft-btn delete-btn"
                  onClick={() => onDeletePost(post.id)}
                  title="Delete Post"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
