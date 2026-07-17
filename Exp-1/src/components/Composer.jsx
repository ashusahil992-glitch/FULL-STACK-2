import React, { useState } from 'react';

const COMMON_EMOJIS = ['😀', '😂', '🔥', '🚀', '🎉', '👍', '❤️', '👀', '✨', '💡', '🙌', '💯', '🤔', '📌', '💻'];

export default function Composer({
  text,
  setText,
  activePlatforms,
  togglePlatform,
  wordCount,
  wordLimits
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const platforms = [
    { id: 'twitter', label: 'Twitter / X', icon: '🐦' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { id: 'facebook', label: 'Facebook', icon: '👥' },
    { id: 'instagram', label: 'Instagram', icon: '📸' },
  ];

  return (
    <div className="composer-container glass-panel animate-fade-in">
      <style>{`
        .composer-container {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .composer-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 4px;
        }
        .section-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .platform-selectors {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 8px;
        }
        .platform-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-glass);
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-secondary);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all var(--transition-normal);
        }
        .platform-chip:hover {
          border-color: var(--border-glass-hover);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }
        .platform-chip.active-twitter {
          border-color: var(--color-twitter);
          background: var(--color-twitter-bg);
          color: var(--color-twitter);
          box-shadow: 0 0 12px rgba(29, 161, 242, 0.2);
        }
        .platform-chip.active-linkedin {
          border-color: var(--color-linkedin);
          background: var(--color-linkedin-bg);
          color: var(--color-linkedin);
          box-shadow: 0 0 12px rgba(10, 102, 194, 0.2);
        }
        .platform-chip.active-facebook {
          border-color: var(--color-facebook);
          background: var(--color-facebook-bg);
          color: var(--color-facebook);
          box-shadow: 0 0 12px rgba(24, 119, 242, 0.2);
        }
        .platform-chip.active-instagram {
          border-color: #dc2743;
          background: var(--color-instagram-bg);
          color: #dc2743;
          box-shadow: 0 0 12px rgba(220, 39, 67, 0.2);
        }
        .editor-wrapper {
          position: relative;
          background: var(--bg-glass-input);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: border-color var(--transition-normal);
        }
        .editor-wrapper:focus-within {
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-glow);
        }
        .editor-textarea {
          width: 100%;
          min-height: 180px;
          border: none;
          background: transparent;
          outline: none;
          resize: vertical;
          padding: 16px;
          color: var(--text-primary);
          font-family: var(--font-family);
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .editor-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid var(--border-glass);
        }
        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }
        .toolbar-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .toolbar-btn:hover {
          color: var(--text-primary);
          background: var(--bg-glass-hover);
        }
        .emoji-dropdown {
          position: absolute;
          bottom: 40px;
          left: 0;
          background: var(--bg-solid-card);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 8px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
          z-index: 10;
          box-shadow: var(--shadow-premium);
        }
        .emoji-item {
          font-size: 1.25rem;
          padding: 4px;
          cursor: pointer;
          border-radius: var(--radius-xs);
          transition: background-color var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .emoji-item:hover {
          background-color: var(--bg-glass-hover);
        }
      `}</style>

      <div>
        <h2 className="composer-title">Compose Post</h2>
        <p className="subtitle">Select platforms and draft your text post.</p>
      </div>

      <div>
        <div className="section-label">Select Platforms</div>
        <div className="platform-selectors">
          {platforms.map((platform) => {
            const isActive = activePlatforms.includes(platform.id);
            const activeClass = isActive ? `active-${platform.id}` : '';
            return (
              <button
                key={platform.id}
                className={`platform-chip ${activeClass}`}
                onClick={() => togglePlatform(platform.id)}
              >
                <span>{platform.icon}</span>
                {platform.label}
              </button>
            );
          })}
        </div>
      </div>

      {activePlatforms.length > 0 && (
        <div style={{ marginTop: '-4px' }}>
          <div className="section-label" style={{ marginBottom: '6px' }}>Word Count Constraints</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {activePlatforms.map((platId) => {
              const limit = wordLimits[platId];
              const isExceeded = wordCount > limit;
              const platName = platId === 'twitter' ? 'Twitter' : platId === 'linkedin' ? 'LinkedIn' : platId === 'facebook' ? 'Facebook' : 'Instagram';
              const icon = platId === 'twitter' ? '🐦' : platId === 'linkedin' ? '💼' : platId === 'facebook' ? '👥' : '📸';
              
              return (
                <span
                  key={platId}
                  style={{
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: isExceeded ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isExceeded ? 'var(--color-danger)' : 'var(--border-glass)'}`,
                    color: isExceeded ? 'var(--color-danger)' : 'var(--text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{icon}</span>
                  <span>{platName}: {wordCount} / {limit} words</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="section-label">Post Content</div>
        <div className="editor-wrapper">
          <textarea
            className="editor-textarea"
            placeholder="Type your draft here..."
            value={text}
            onChange={handleTextChange}
          />
          <div className="editor-toolbar">
            <div className="toolbar-actions">
              <button
                className="toolbar-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Add Emoji"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </button>
              {showEmojiPicker && (
                <div className="emoji-dropdown">
                  {COMMON_EMOJIS.map((emoji) => (
                    <span
                      key={emoji}
                      className="emoji-item"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
              <button
                className="toolbar-btn"
                onClick={() => setText((prev) => prev + ' #')}
                title="Add Hashtag"
              >
                <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>#</span>
              </button>
              <button
                className="toolbar-btn"
                onClick={() => setText((prev) => prev + ' @')}
                title="Add Mention"
              >
                <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>@</span>
              </button>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {wordCount} words
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
