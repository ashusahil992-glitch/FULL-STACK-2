import React, { useState } from "react";
import "./App.css";

function App() {
  const limits = {
    Twitter: 280,
    Facebook: 5000,
    LinkedIn: 3000,
    Instagram: 2200,
  };

  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const limit = limits[platform];
  const remaining = limit - post.length;

  const handlePublish = () => {
    if (editIndex !== null) {
      const updatedPosts = [...posts];
      updatedPosts[editIndex] = { platform, text: post };
      setPosts(updatedPosts);
      setEditIndex(null);
    } else {
      setPosts([...posts, { platform, text: post }]);
    }

    setPost("");
  };

  const handleEdit = (index) => {
    setPlatform(posts[index].platform);
    setPost(posts[index].text);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedPosts = posts.filter((_, i) => i !== index);
    setPosts(updatedPosts);

    if (editIndex === index) {
      setEditIndex(null);
      setPost("");
    }
  };

  return (
    <div className="container">
      <h1>Dynamic Post Composer</h1>

      <label><b>Select Platform</b></label>

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        {Object.keys(limits).map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <textarea
        rows="6"
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
        disabled={remaining < 0 || post.trim() === ""}
        onClick={handlePublish}
      >
        {editIndex !== null ? "Update Post" : "Publish"}
      </button>

      <hr />

      <h2>Published Posts</h2>

      {posts.length === 0 ? (
        <p>No posts published yet.</p>
      ) : (
        posts.map((item, index) => (
          <div className="post" key={index}>
            <h3>{item.platform}</h3>

            <p>{item.text}</p>

            <button
              className="edit"
              onClick={() => handleEdit(index)}
            >
              Edit
            </button>

            <button
              className="delete"
              onClick={() => handleDelete(index)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;