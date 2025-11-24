import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, UserPlus, UserMinus } from 'lucide-react';
import PostCard from '../components/PostCard';
import { getUserProfile, getUserPosts, followUser, unfollowUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      const [profileRes, postsRes] = await Promise.all([
        getUserProfile(username),
        getUserPosts(username),
      ]);
      setUser(profileRes.data.user);
      setPosts(postsRes.data.posts);
      setIsFollowing(profileRes.data.user.followers?.some((f) => f._id === currentUser?._id));
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
      setIsFollowing(!isFollowing);
      loadProfile();
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error-state">User not found</div>;
  }

  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="page-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.username} />
          ) : (
            <span>{user.username[0].toUpperCase()}</span>
          )}
        </div>

        <div className="profile-info">
          <h1>{user.displayName || user.username}</h1>
          <p className="profile-username">@{user.username}</p>
          {user.bio && <p className="profile-bio">{user.bio}</p>}

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.followers?.length || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.following?.length || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              className={`btn-follow ${isFollowing ? 'following' : ''}`}
            >
              {isFollowing ? (
                <>
                  <UserMinus size={20} />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Follow
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="profile-posts">
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet.</p>
          </div>
        ) : (
          <div className="posts-feed">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
