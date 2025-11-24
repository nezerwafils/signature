import React, { useState, useEffect } from 'react';
import { Mic, Upload } from 'lucide-react';
import PostCard from '../components/PostCard';
import { getFeed, createPost } from '../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const loadFeed = async () => {
    try {
      const response = await getFeed();
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
        setAudioFile(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      alert('Please select or record an audio file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('caption', caption);
      formData.append('duration', recordingTime || 0);

      await createPost(formData);
      setShowCreateModal(false);
      setCaption('');
      setAudioFile(null);
      setRecordingTime(0);
      loadFeed();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Home Feed</h1>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <Mic size={20} />
          Create Post
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading feed...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet. Follow users or create your first post!</p>
        </div>
      ) : (
        <div className="posts-feed">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Post</h2>
              <button onClick={() => setShowCreateModal(false)} className="close-button">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="create-post-form">
              <div className="form-group">
                <label>Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's on your mind?"
                  className="form-textarea"
                  maxLength="500"
                />
              </div>

              <div className="audio-upload-section">
                <div className="recording-controls">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="btn-record"
                      disabled={audioFile}
                    >
                      <Mic size={20} />
                      Start Recording
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="btn-stop-recording"
                      >
                        Stop Recording
                      </button>
                      <span className="recording-time">{formatTime(recordingTime)}</span>
                    </>
                  )}
                </div>

                <div className="divider">OR</div>

                <div className="file-upload">
                  <label htmlFor="audio-file" className="file-upload-label">
                    <Upload size={20} />
                    Upload Audio File
                  </label>
                  <input
                    type="file"
                    id="audio-file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="file-input"
                    disabled={isRecording}
                  />
                  {audioFile && (
                    <p className="file-name">Selected: {audioFile.name}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!audioFile || uploading}
                className="btn-primary"
              >
                {uploading ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
