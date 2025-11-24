import React, { useState, useEffect } from 'react';
import { postAPI } from '../services/api';
import AudioPostCard from '../components/AudioPostCard';
import './DiscoverPage.css';

const DiscoverPage = () => {
  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscover();
    fetchTrending();
  }, []);

  const fetchDiscover = async () => {
    try {
      const response = await postAPI.getDiscover();
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching discover:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await postAPI.getTrendingHashtags();
      setTrending(response.data.hashtags);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  return (
    <div className="discover-page">
      <div className="container">
        <div className="discover-content">
          <div className="main-feed">
            <div className="feed-header">
              <h1 className="page-title">Discover</h1>
              <p className="page-subtitle">Explore trending voices and new content</p>
            </div>

            {trending.length > 0 && (
              <div className="trending-section">
                <h3 className="section-heading">Trending Hashtags</h3>
                <div className="hashtag-list">
                  {trending.slice(0, 10).map((tag) => (
                    <span key={tag._id} className="hashtag-badge">
                      #{tag._id} <span className="hashtag-count">{tag.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="posts-list">
              {loading && (
                <div className="loader">
                  <div className="spinner"></div>
                </div>
              )}

              {posts.map(post => (
                <AudioPostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
