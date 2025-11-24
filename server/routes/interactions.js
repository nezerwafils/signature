const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// Like a post
router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.userId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => !id.equals(req.userId));
    } else {
      // Like
      post.likes.push(req.userId);

      // Create notification
      if (!post.author.equals(req.userId)) {
        const notification = new Notification({
          recipient: post.author,
          sender: req.userId,
          type: 'like',
          post: post._id
        });
        await notification.save();
      }
    }

    await post.save();

    res.json({
      message: isLiked ? 'Post unliked' : 'Post liked',
      likesCount: post.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    res.status(500).json({ error: 'Error liking post' });
  }
});

// Comment on a post
router.post('/posts/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = new Comment({
      post: post._id,
      author: req.userId,
      text: text.trim()
    });

    await comment.save();
    await comment.populate('author', 'username displayName avatar');

    // Update comment count
    post.commentCount += 1;
    await post.save();

    // Create notification
    if (!post.author.equals(req.userId)) {
      const notification = new Notification({
        recipient: post.author,
        sender: req.userId,
        type: 'comment',
        post: post._id,
        comment: comment._id
      });
      await notification.save();
    }

    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error adding comment' });
  }
});

// Get comments for a post
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username displayName avatar');

    const total = await Comment.countDocuments({ post: req.params.id });

    res.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// Delete a comment
router.delete('/comments/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (!comment.author.equals(req.userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    // Update post comment count
    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentCount: -1 }
    });

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

// Like a comment
router.post('/comments/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const isLiked = comment.likes.includes(req.userId);

    if (isLiked) {
      comment.likes = comment.likes.filter(id => !id.equals(req.userId));
    } else {
      comment.likes.push(req.userId);
    }

    await comment.save();

    res.json({
      message: isLiked ? 'Comment unliked' : 'Comment liked',
      likesCount: comment.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    res.status(500).json({ error: 'Error liking comment' });
  }
});

// Share a post
router.post('/posts/:id/share', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { shareCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Create notification
    if (!post.author.equals(req.userId)) {
      const notification = new Notification({
        recipient: post.author,
        sender: req.userId,
        type: 'share',
        post: post._id
      });
      await notification.save();
    }

    res.json({ message: 'Post shared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sharing post' });
  }
});

// Get user notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'username displayName avatar')
      .populate('post', 'caption audioUrl');

    const total = await Notification.countDocuments({ recipient: req.userId });
    const unreadCount = await Notification.countDocuments({ recipient: req.userId, isRead: false });

    res.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating notification' });
  }
});

// Mark all notifications as read
router.put('/notifications/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating notifications' });
  }
});

module.exports = router;
