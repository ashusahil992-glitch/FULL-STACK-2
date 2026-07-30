import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPost, updatePost, deletePost } from "./features/posts/postSlice";

import {
  selectAllPosts,
  selectTotalPosts,
  selectTwitterPosts,
  selectFacebookPosts,
  selectLinkedInPosts,
  selectInstagramPosts,
} from "./features/posts/selectors";

import PostCard from "./components/PostCard";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  // Memoized Selectors
  const posts = useSelector(selectAllPosts);
  const totalPosts = useSelector(selectTotalPosts);
  const twitterPosts = useSelector(selectTwitterPosts);
  const facebookPosts = useSelector(selectFacebookPosts);
  const linkedInPosts = useSelector(selectLinkedInPosts);
  const instagramPosts = useSelector(selectInstagramPosts);

  const limits = {
    Twitter: 280,
    Facebook: 5000,
    LinkedIn: 3000,
    Instagram: 2200,
  };

  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const limit = limits[platform];
  const remaining = limit - post.length;

  // useMemo to avoid unnecessary recalculation
  const sortedPosts = useMemo(() => {
    return [...posts].reverse();
  }, [posts]);

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

      <h2>Derived State (Memoized Selectors)</h2>

      <p><strong>Total Posts:</strong> {totalPosts}</p>
      <p><strong>Twitter:</strong> {twitterPosts.length}</p>
      <p><strong>Facebook:</strong> {facebookPosts.length}</p>
      <p><strong>LinkedIn:</strong> {linkedInPosts.length}</p>
      <p><strong>Instagram:</strong> {instagramPosts.length}</p>

      <hr />

      <h2>Published Posts</h2>

      {sortedPosts.length === 0 ? (
        <p>No posts published yet.</p>
      ) : (
        sortedPosts.map((item, index) => (
          <PostCard
            key={index}
            post={item}
            index={index}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
export default App;