const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// Create a new post
router.post('/', auth, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const { caption, duration, hashtags } = req.body;

    // Parse hashtags
    let hashtagsArray = [];
    if (hashtags) {
      hashtagsArray = typeof hashtags === 'string' ? JSON.parse(hashtags) : hashtags;
    }

    const post = new Post({
      author: req.userId,
      audioUrl: `/uploads/${req.file.filename}`,
      duration: duration || 0,
      caption: caption || '',
      hashtags: hashtagsArray
    });

    await post.save();
    await post.populate('author', 'username displayName avatar');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: error.message || 'Error creating post' });
  }
});

// Get feed (posts from followed users)
router.get('/feed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get posts from followed users and own posts
    const posts = await Post.find({
      author: { $in: [...user.following, req.userId] },
      isPublic: true
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username displayName avatar');

    const total = await Post.countDocuments({
      author: { $in: [...user.following, req.userId] },
      isPublic: true
    });

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
    res.status(500).json({ error: 'Error fetching feed' });
  }
});

// Get discover feed (all public posts)
router.get('/discover', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isPublic: true })
      .sort({ createdAt: -1, playCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username displayName avatar');

    const total = await Post.countDocuments({ isPublic: true });

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
    res.status(500).json({ error: 'Error fetching discover feed' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username displayName avatar');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.author.equals(req.userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
});

// Increment play count
router.post('/:id/play', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Play count updated' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating play count' });
  }
});

// Search posts by hashtag
router.get('/hashtag/:tag', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      hashtags: req.params.tag,
      isPublic: true
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username displayName avatar');

    const total = await Post.countDocuments({
      hashtags: req.params.tag,
      isPublic: true
    });

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
    res.status(500).json({ error: 'Error searching posts' });
  }
});

// Get trending hashtags
router.get('/trending/hashtags', async (req, res) => {
  try {
    const hashtags = await Post.aggregate([
      { $unwind: '$hashtags' },
      { $group: { _id: '$hashtags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({ hashtags });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching trending hashtags' });
  }
});

module.exports = router;
