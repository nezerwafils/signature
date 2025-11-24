import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { getDiscoverPosts } from '../services/api';

const Discover = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await getDiscoverPosts();
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error loading discover posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Discover</h1>
        <p>Explore trending audio posts from the community</p>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts to discover yet.</p>
        </div>
      ) : (
        <div className="posts-feed">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discover;
