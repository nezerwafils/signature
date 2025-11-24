import React, { useState, useRef } from 'react';
import { postAPI } from '../services/api';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Could not access microphone. Please check permissions.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!audioBlob) {
      setError('Please record audio first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('caption', caption);
      formData.append('duration', 0); // Will be calculated on server
      
      if (hashtags.trim()) {
        const hashtagArray = hashtags
          .split(',')
          .map(tag => tag.trim().replace(/^#/, ''))
          .filter(tag => tag.length > 0);
        formData.append('hashtags', JSON.stringify(hashtagArray));
      }

      const response = await postAPI.createPost(formData);
      
      if (onPostCreated) {
        onPostCreated(response.data.post);
      }

      // Reset form
      setAudioBlob(null);
      setCaption('');
      setHashtags('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setAudioBlob(null);
    setCaption('');
    setHashtags('');
    setError('');
  };

  return (
    <div className="create-post card">
      <h3 className="create-post-title">Share Your Voice</h3>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="record-section">
          {!audioBlob ? (
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`record-button ${isRecording ? 'recording' : ''}`}
            >
              <div className="record-icon">
                {isRecording ? (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                    <rect x="8" y="8" width="16" height="16" rx="2"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                    <circle cx="16" cy="16" r="12"/>
                  </svg>
                )}
              </div>
              <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </button>
          ) : (
            <div className="audio-preview">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a6 6 0 016 6v4a6 6 0 11-12 0V8a6 6 0 016-6z"/>
                <path d="M4 12a8 8 0 0016 0M12 18v4M8 22h8"/>
              </svg>
              <span>Audio recorded successfully!</span>
              <button type="button" onClick={handleCancel} className="btn-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {audioBlob && (
          <>
            <div className="form-group">
              <label htmlFor="caption" className="form-label">Caption</label>
              <textarea
                id="caption"
                className="input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's on your mind?"
                rows="3"
                maxLength="300"
              />
              <small className="form-hint">{caption.length}/300</small>
            </div>

            <div className="form-group">
              <label htmlFor="hashtags" className="form-label">Hashtags</label>
              <input
                type="text"
                id="hashtags"
                className="input"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="music, podcast, thoughts (comma separated)"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
