const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Get user profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() })
      .select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's post count
    const postCount = await Post.countDocuments({ author: user._id });

    res.json({
      ...user.toJSON(),
      postCount,
      followerCount: user.followers.length,
      followingCount: user.following.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Update profile (authenticated)
router.put('/profile', auth, async (req, res) => {
  try {
    const { displayName, bio, avatar } = req.body;
    const updates = {};

    if (displayName !== undefined) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error updating profile' });
  }
});

// Follow user
router.post('/:username/follow', auth, async (req, res) => {
  try {
    const targetUser = await User.findOne({ username: req.params.username.toLowerCase() });
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser._id.equals(req.userId)) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const currentUser = await User.findById(req.userId);

    // Check if already following
    if (currentUser.following.includes(targetUser._id)) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Add to following/followers
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();

    // Create notification
    const notification = new Notification({
      recipient: targetUser._id,
      sender: currentUser._id,
      type: 'follow'
    });
    await notification.save();

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).json({ error: 'Error following user' });
  }
});

// Unfollow user
router.post('/:username/unfollow', auth, async (req, res) => {
  try {
    const targetUser = await User.findOne({ username: req.params.username.toLowerCase() });
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUser = await User.findById(req.userId);

    // Remove from following/followers
    currentUser.following = currentUser.following.filter(id => !id.equals(targetUser._id));
    targetUser.followers = targetUser.followers.filter(id => !id.equals(currentUser._id));

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    res.status(500).json({ error: 'Error unfollowing user' });
  }
});

// Get user's posts
router.get('/:username/posts', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: user._id, isPublic: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username displayName avatar');

    const total = await Post.countDocuments({ author: user._id, isPublic: true });

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user posts' });
  }
});

// Get followers
router.get('/:username/followers', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() })
      .populate('followers', 'username displayName avatar');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ followers: user.followers });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching followers' });
  }
});

// Get following
router.get('/:username/following', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() })
      .populate('following', 'username displayName avatar');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ following: user.following });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching following' });
  }
});

// Search users
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ]
    })
    .select('username displayName avatar')
    .limit(20);

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error searching users' });
  }
});

module.exports = router;
