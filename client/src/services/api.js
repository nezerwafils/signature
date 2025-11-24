import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  recover: (email) => api.post('/auth/recover', { email })
};

// User endpoints
export const userAPI = {
  getProfile: (username) => api.get(`/users/${username}`),
  updateProfile: (data) => api.put('/users/profile', data),
  follow: (username) => api.post(`/users/${username}/follow`),
  unfollow: (username) => api.post(`/users/${username}/unfollow`),
  getUserPosts: (username, page = 1) => api.get(`/users/${username}/posts?page=${page}`),
  getFollowers: (username) => api.get(`/users/${username}/followers`),
  getFollowing: (username) => api.get(`/users/${username}/following`),
  searchUsers: (query) => api.get(`/users/search/query?q=${query}`)
};

// Post endpoints
export const postAPI = {
  createPost: (formData) => {
    return api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getFeed: (page = 1) => api.get(`/posts/feed?page=${page}`),
  getDiscover: (page = 1) => api.get(`/posts/discover?page=${page}`),
  getPost: (id) => api.get(`/posts/${id}`),
  deletePost: (id) => api.delete(`/posts/${id}`),
  incrementPlay: (id) => api.post(`/posts/${id}/play`),
  getByHashtag: (tag, page = 1) => api.get(`/posts/hashtag/${tag}?page=${page}`),
  getTrendingHashtags: () => api.get('/posts/trending/hashtags')
};

// Interaction endpoints
export const interactionAPI = {
  likePost: (id) => api.post(`/interactions/posts/${id}/like`),
  commentPost: (id, text) => api.post(`/interactions/posts/${id}/comment`, { text }),
  getComments: (id, page = 1) => api.get(`/interactions/posts/${id}/comments?page=${page}`),
  deleteComment: (id) => api.delete(`/interactions/comments/${id}`),
  likeComment: (id) => api.post(`/interactions/comments/${id}/like`),
  sharePost: (id) => api.post(`/interactions/posts/${id}/share`),
  getNotifications: (page = 1) => api.get(`/interactions/notifications?page=${page}`),
  markNotificationRead: (id) => api.put(`/interactions/notifications/${id}/read`),
  markAllRead: () => api.put('/interactions/notifications/read-all')
};

export default api;
