import React, { useState, useEffect } from 'react';
import { postAPI } from '../services/api';
import AudioPostCard from '../components/AudioPostCard';
import CreatePost from '../components/CreatePost';
import './HomePage.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await postAPI.getFeed(pageNum);
      const newPosts = response.data.posts;
      
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(response.data.pagination.page < response.data.pagination.pages);
      setPage(pageNum);
      setError('');
    } catch (err) {
      setError('Failed to load feed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const loadMore = () => {
    fetchFeed(page + 1);
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="home-content">
          <div className="main-feed">
            <div className="feed-header">
              <h1 className="page-title">Your Feed</h1>
              <p className="page-subtitle">Latest posts from people you follow</p>
            </div>

            <CreatePost onPostCreated={handleNewPost} />

            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            <div className="posts-list">
              {posts.length === 0 && !loading && (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
                    <path d="M32 16v32M24 24v16M40 24v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <h3>No posts yet</h3>
                  <p>Follow users or create your first post to see content here</p>
                </div>
              )}

              {posts.map(post => (
                <AudioPostCard key={post._id} post={post} />
              ))}
            </div>

            {loading && (
              <div className="loader">
                <div className="spinner"></div>
              </div>
            )}

            {!loading && hasMore && posts.length > 0 && (
              <button onClick={loadMore} className="btn btn-secondary load-more-btn">
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
