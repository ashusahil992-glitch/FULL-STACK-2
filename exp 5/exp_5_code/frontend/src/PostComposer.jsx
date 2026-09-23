import React, { useState } from 'react';

const WORD_LIMITS = {
  Twitter: 50,
  Instagram: 100,
  Facebook: 200
};
const MAX_CONTENT_LENGTH = 255;

const PostComposer = ({ onPostCreate, onError }) => {
  const [platform, setPlatform] = useState('Twitter');
  const [content, setContent] = useState('');

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const truncateToPlatformLimit = (text, limit) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const truncatedWords = words.slice(0, limit);
    return truncatedWords.join(' ') + (text.endsWith(' ') && truncatedWords.length > 0 ? ' ' : '');
  };

  const handleContentChange = (e) => {
    const text = e.target.value;
    const limit = WORD_LIMITS[platform];
    const trimmedText = text.length > MAX_CONTENT_LENGTH ? text.slice(0, MAX_CONTENT_LENGTH) : text;
    const words = countWords(trimmedText);

    if (words > limit || trimmedText.length > MAX_CONTENT_LENGTH) {
      onError(`Word limit reached for ${platform}! Maximum allowed is ${limit} words.`);
      const truncatedText = truncateToPlatformLimit(trimmedText, limit);
      setContent(truncatedText);
      return;
    }

    onError(null);
    setContent(trimmedText);
  };

  const handlePlatformChange = (e) => {
    setPlatform(e.target.value);
    setContent('');
    onError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || countWords(content) > WORD_LIMITS[platform] || content.length > MAX_CONTENT_LENGTH) {
      onError(`Word limit reached for ${platform}! Maximum allowed is ${WORD_LIMITS[platform]} words.`);
      return;
    }

    onPostCreate({ platform, content });
    setContent('');
  };

  return (
    <div className="composer-card">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Platform</label>
          <select value={platform} onChange={handlePlatformChange}>
            <option value="Twitter">Twitter (50 words)</option>
            <option value="Instagram">Instagram (100 words)</option>
            <option value="Facebook">Facebook (200 words)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Post Content</label>
          <textarea 
            rows="5"
            placeholder="What's on your mind?"
            value={content}
            onChange={handleContentChange}
          />
          <div className="word-count">
            Words: {countWords(content)} / {WORD_LIMITS[platform]}
          </div>
        </div>

        <button type="submit" className="primary-btn">Post</button>
      </form>
    </div>
  );
};

export default PostComposer;
