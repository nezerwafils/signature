import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import AudioPostCard from '../components/AudioPostCard';
import './ProfilePage.css';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile(username);
      setProfile(response.data);
      setIsFollowing(response.data.followers?.includes(currentUser?.id));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await userAPI.getUserPosts(username);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userAPI.unfollow(username);
      } else {
        await userAPI.follow(username);
      }
      setIsFollowing(!isFollowing);
      fetchProfile();
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  if (loading || !profile) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.username} />
            ) : (
              <span>{profile.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{profile.displayName || profile.username}</h1>
            <p className="profile-username">@{profile.username}</p>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{profile.postCount || 0}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat">
                <span className="stat-value">{profile.followerCount || 0}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-value">{profile.followingCount || 0}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        <div className="profile-posts">
          <h2 className="section-heading">Posts</h2>
          <div className="posts-list">
            {posts.length === 0 ? (
              <div className="empty-state">
                <p>No posts yet</p>
              </div>
            ) : (
              posts.map(post => <AudioPostCard key={post._id} post={post} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
