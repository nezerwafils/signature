import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreVertical, Trash2 } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { toggleLike, addComment, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes?.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async () => {
    try {
      const response = await toggleLike(post._id);
      setLiked(!liked);
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await addComment(post._id, commentText);
      setComments(response.data.comments);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post._id);
        onDelete?.(post._id);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post._id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const isOwner = user?._id === post.user?._id;
  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.user?.username}`} className="post-user">
          <div className="user-avatar">
            {post.user?.profileImage ? (
              <img src={post.user.profileImage} alt={post.user.username} />
            ) : (
              <span>{post.user?.username?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <div className="user-info">
            <span className="username">{post.user?.displayName || post.user?.username}</span>
            <span className="user-handle">@{post.user?.username}</span>
          </div>
        </Link>
        
        {isOwner && (
          <div className="post-menu">
            <button onClick={() => setShowMenu(!showMenu)} className="menu-button">
              <MoreVertical size={20} />
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={handleDelete} className="menu-item delete">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {post.caption && <p className="post-caption">{post.caption}</p>}

      <AudioPlayer 
        src={`${apiBaseUrl}${post.audioUrl}`}
        duration={post.duration}
      />

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`action-button ${liked ? 'liked' : ''}`}
        >
          <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="action-button"
        >
          <MessageCircle size={20} />
          <span>{comments.length}</span>
        </button>

        <button onClick={handleShare} className="action-button">
          <Share2 size={20} />
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="comment-input"
            />
            <button type="submit" className="comment-submit">
              Post
            </button>
          </form>

          <div className="comments-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <Link to={`/profile/${comment.user?.username}`} className="comment-user">
                  @{comment.user?.username}
                </Link>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="post-time">
        {new Date(post.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default PostCard;
