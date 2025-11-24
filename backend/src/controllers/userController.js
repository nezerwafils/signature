const User = require('../models/User');

// Follow user
exports.followUser = async (req, res) => {
  try {
    const { username } = req.params;
    const userToFollow = await User.findOne({ username });

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userToFollow._id.toString() === req.userId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const currentUser = await User.findById(req.userId);

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(req.userId);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Unfollow user
exports.unfollowUser = async (req, res) => {
  try {
    const { username } = req.params;
    const userToUnfollow = await User.findOne({ username });

    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUser = await User.findById(req.userId);

    // Check if following
    const followingIndex = currentUser.following.indexOf(userToUnfollow._id);
    if (followingIndex === -1) {
      return res.status(400).json({ error: 'Not following this user' });
    }

    currentUser.following.splice(followingIndex, 1);
    const followerIndex = userToUnfollow.followers.indexOf(req.userId);
    userToUnfollow.followers.splice(followerIndex, 1);

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get followers
exports.getFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .populate('followers', 'username displayName profileImage');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ followers: user.followers });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get following
exports.getFollowing = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .populate('following', 'username displayName profileImage');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ following: user.following });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ]
    })
      .select('-password')
      .limit(20);

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
