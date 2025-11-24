import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getCurrentUser = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const getUserProfile = (username) => api.get(`/auth/profile/${username}`);

// Posts
export const createPost = (formData) => {
  return api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getFeed = (page = 1, limit = 20) => api.get(`/posts/feed?page=${page}&limit=${limit}`);
export const getDiscoverPosts = (page = 1, limit = 20) => api.get(`/posts/discover?page=${page}&limit=${limit}`);
export const getUserPosts = (username) => api.get(`/posts/user/${username}`);
export const getPost = (id) => api.get(`/posts/${id}`);
export const toggleLike = (id) => api.post(`/posts/${id}/like`);
export const addComment = (id, text) => api.post(`/posts/${id}/comment`, { text });
export const deletePost = (id) => api.delete(`/posts/${id}`);

// Users
export const followUser = (username) => api.post(`/users/${username}/follow`);
export const unfollowUser = (username) => api.post(`/users/${username}/unfollow`);
export const getFollowers = (username) => api.get(`/users/${username}/followers`);
export const getFollowing = (username) => api.get(`/users/${username}/following`);
export const searchUsers = (query) => api.get(`/users/search?q=${query}`);

export default api;
