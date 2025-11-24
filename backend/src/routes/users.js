const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Follow user
router.post('/:username/follow', auth, userController.followUser);

// Unfollow user
router.post('/:username/unfollow', auth, userController.unfollowUser);

// Get followers
router.get('/:username/followers', auth, userController.getFollowers);

// Get following
router.get('/:username/following', auth, userController.getFollowing);

// Search users
router.get('/search', auth, userController.searchUsers);

module.exports = router;
