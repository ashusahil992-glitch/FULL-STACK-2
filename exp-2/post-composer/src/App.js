import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPost, updatePost, deletePost } from "./features/posts/postSlice";
import "./App.css";

function App() {
  const limits = {
    Twitter: 280,
    Facebook: 5000,
    LinkedIn: 3000,
    Instagram: 2200,
  };

  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);

  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const limit = limits[platform];
  const remaining = limit - post.length;

  const handlePublish = () => {
    if (post.trim() === "" || remaining < 0) return;

    const newPost = {
      platform,
      text: post,
    };

    if (editIndex !== null) {
      dispatch(
        updatePost({
          index: editIndex,
          post: newPost,
        })
      );
      setEditIndex(null);
    } else {
      dispatch(addPost(newPost));
    }

    setPost("");
    setPlatform("Twitter");
  };

  const handleEdit = (index) => {
    setPlatform(posts[index].platform);
    setPost(posts[index].text);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    dispatch(deletePost(index));

    if (editIndex === index) {
      setEditIndex(null);
      setPost("");
      setPlatform("Twitter");
    }
  };

  return (
    <div className="container">
      <h1>Dynamic Post Composer</h1>

      <label>Select Platform</label>

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        {Object.keys(limits).map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <textarea
        rows="7"
        placeholder="Write your post..."
        value={post}
        onChange={(e) => setPost(e.target.value)}
      />

      <h3>
        Characters: {post.length}/{limit}
      </h3>

      {remaining >= 0 ? (
        <p className="success">✔ Ready to Publish</p>
      ) : (
        <p className="error">
          ✖ Character limit exceeded by {-remaining} characters
        </p>
      )}

      <button
        onClick={handlePublish}
        disabled={post.trim() === "" || remaining < 0}
      >
        {editIndex !== null ? "Update Post" : "Publish"}
      </button>

      <hr />

      <h2>Published Posts</h2>

      {posts.length === 0 ? (
        <p>No posts published yet.</p>
      ) : (
        posts.map((item, index) => (
          <div className="post-card" key={index}>
            <h3>{item.platform}</h3>

            <p>{item.text}</p>

            <div className="btn-group">
              <button
                className="edit-btn"
                onClick={() => handleEdit(index)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;