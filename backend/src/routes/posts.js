const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createPostLimiter } = require('../middleware/rateLimiter');

// Create post
router.post('/', auth, createPostLimiter, upload.single('audio'), postController.createPost);

// Get feed
router.get('/feed', auth, postController.getFeed);

// Get discover posts
router.get('/discover', auth, postController.getDiscoverPosts);

// Get user posts
router.get('/user/:username', auth, postController.getUserPosts);

// Get single post
router.get('/:id', auth, postController.getPost);

// Like/Unlike post
router.post('/:id/like', auth, postController.toggleLike);

// Add comment
router.post('/:id/comment', auth, postController.addComment);

// Delete post
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
