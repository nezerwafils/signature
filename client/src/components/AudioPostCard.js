import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interactionAPI, postAPI } from '../services/api';
import './AudioPostCard.css';

const AudioPostCard = ({ post }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(post.duration || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      // Increment play count
      if (currentTime === 0) {
        try {
          await postAPI.incrementPlay(post._id);
        } catch (error) {
          console.error('Error incrementing play count:', error);
        }
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const handleLike = async () => {
    try {
      const response = await interactionAPI.likePost(post._id);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-post-card card">
      <div className="post-header">
        <Link to={`/profile/${post.author.username}`} className="author-info">
          <div className="author-avatar">
            {post.author.avatar ? (
              <img src={post.author.avatar} alt={post.author.username} />
            ) : (
              <span>{post.author.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="author-name">{post.author.displayName || post.author.username}</div>
            <div className="author-username">@{post.author.username}</div>
          </div>
        </Link>
        <span className="post-time">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      {post.caption && <p className="post-caption">{post.caption}</p>}

      <div className="audio-player">
        <audio ref={audioRef} src={post.audioUrl} preload="metadata" />
        
        <button onClick={togglePlay} className="play-button">
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <div className="audio-controls">
          <div className="progress-bar" onClick={handleSeek}>
            <div
              className="progress-fill"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="audio-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="post-hashtags">
          {post.hashtags.map((tag, index) => (
            <span key={index} className="hashtag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`action-button ${isLiked ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
          </svg>
          <span>{likesCount}</span>
        </button>

        <button className="action-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/>
            <path d="M2 8h16"/>
          </svg>
          <span>{post.commentCount || 0}</span>
        </button>

        <button className="action-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 8a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path d="M12.93 11.93l3.17 3.17M2 18l3.17-3.17"/>
          </svg>
          <span>{post.shareCount || 0}</span>
        </button>

        <button className="action-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 10a5 5 0 11-10 0 5 5 0 0110 0z"/>
            <path d="M10 7v3l2 2"/>
          </svg>
          <span>{post.playCount || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default AudioPostCard;
