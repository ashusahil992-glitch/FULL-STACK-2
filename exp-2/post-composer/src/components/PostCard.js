import React from "react";

function PostCard({ post, index, onEdit, onDelete }) {
  console.log("Rendering:", post.platform);

  return (
    <div className="post-card">
      <h3>{post.platform}</h3>

      <p>{post.text}</p>

      <div className="btn-group">
        <button
          className="edit-btn"
          onClick={() => onEdit(index)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(index)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// React.memo prevents unnecessary re-rendering
export default React.memo(PostCard);