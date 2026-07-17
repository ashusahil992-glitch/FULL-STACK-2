import React, { useState, useEffect } from 'react';
import Composer from './components/Composer';
import PublishedPosts from './components/PublishedPosts';

const WORD_LIMITS = {
  twitter: 50,
  linkedin: 500,
  facebook: 1000,
  instagram: 220
};

export default function App() {
  const [text, setText] = useState(
    'Welcome to the Post Composer! Start drafting your content here. Add #hashtags, @mentions, and organize your posts.'
  );
  const [activePlatforms, setActivePlatforms] = useState(['twitter', 'linkedin']);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Calculate word count
  const getWordCount = (val) => {
    const cleanText = val.trim();
    return cleanText === '' ? 0 : cleanText.split(/\s+/).length;
  };
  const wordCount = getWordCount(text);
  
  // Validation state: valid if text has words, at least one platform is active, and no active platform is over-limit
  const isWordLimitExceeded = activePlatforms.some((plat) => wordCount > WORD_LIMITS[plat]);
  const isValid = text.trim().length > 0 && activePlatforms.length > 0 && !isWordLimitExceeded;

  // Saved Posts state, persisted in localStorage
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('post_composer_posts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load posts from localStorage", e);
      return [];
    }
  });

  // Sync posts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('post_composer_posts', JSON.stringify(posts));
    } catch (e) {
      console.error("Failed to persist posts to localStorage", e);
    }
  }, [posts]);

  const togglePlatform = (platformId) => {
    setActivePlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublishPost = () => {
    if (!isValid) return;
    
    setIsSaving(true);
    
    // Simulate server latency
    setTimeout(() => {
      const newPost = {
        id: Date.now().toString(),
        text,
        platforms: activePlatforms,
        timestamp: new Date().toISOString()
      };

      setPosts((prev) => [newPost, ...prev]);
      setIsSaving(false);
      setShowSuccessToast(true);
      
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
    }, 800);
  };

  const handleReusePost = (post) => {
    setText(post.text);
    setActivePlatforms(post.platforms);
  };

  const handleDeletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="app-container">
      <style>{`
        /* Dashboard Layout */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
        }
        .publish-panel {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .toast-overlay {
          position: fixed;
          top: 24px;
          right: 24px;
          background: var(--success-gradient);
          color: white;
          padding: 16px 24px;
          border-radius: var(--radius-md);
          box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-heading);
          font-weight: 600;
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        /* Loader styles */
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #white;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="toast-overlay">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <div style={{ fontSize: '1rem' }}>Success!</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '400', opacity: '0.9' }}>
              Post successfully published across channels!
            </div>
          </div>
        </div>
      )}

      <header className="dashboard-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1>Post Composer</h1>
            <p className="subtitle">Publish, manage, and track your text posts.</p>
          </div>
        </div>

        <div className="publish-panel">
          <button
            className="btn btn-primary"
            onClick={handlePublishPost}
            disabled={!isValid || activePlatforms.length === 0 || isSaving}
          >
            {isSaving ? (
              <>
                <div className="spinner" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Publish Post</span>
              </>
            )}
          </button>
        </div>
      </header>

      <div className="composer-grid">
        {/* Left Column: Composer Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Composer
            text={text}
            setText={setText}
            activePlatforms={activePlatforms}
            togglePlatform={togglePlatform}
            wordCount={wordCount}
            wordLimits={WORD_LIMITS}
          />
        </div>

        {/* Right Column: Published Posts Feed */}
        <PublishedPosts
          posts={posts}
          onReusePost={handleReusePost}
          onDeletePost={handleDeletePost}
        />
      </div>
    </div>
  );
}
