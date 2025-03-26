const User = require('../models/User');
const Video = require('../models/Video');
const Comment = require('../models/Comment');

// Content moderation: remove or flag content
exports.moderateContent = async (req, res, next) => {
  try {
    const { contentType, contentId, action } = req.body;
    // contentType: 'video' or 'comment'
    let updatedItem;
    if (contentType === 'video') {
      updatedItem = await Video.findByIdAndUpdate(contentId, { status: action }, { new: true });
    } else if (contentType === 'comment') {
      updatedItem = await Comment.findByIdAndUpdate(contentId, { status: action }, { new: true });
    } else {
      return res.status(400).json({ message: 'Invalid content type.' });
    }
    res.status(200).json({ updatedItem });
  } catch (error) {
    next(error);
  }
};

// Analytics: sample endpoint for retrieving statistics
exports.getAnalytics = async (req, res, next) => {
  try {
    // Example: count users and videos
    const userCount = await User.countDocuments();
    const videoCount = await Video.countDocuments();
    // More advanced analytics can be added here
    res.status(200).json({ userCount, videoCount });
  } catch (error) {
    next(error);
  }
};

// User management: update or delete user accounts
exports.manageUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { action, updates } = req.body;
    if (action === 'update') {
      const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
      res.status(200).json({ user: updatedUser });
    } else if (action === 'delete') {
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: 'User deleted successfully.' });
    } else {
      res.status(400).json({ message: 'Invalid action.' });
    }
  } catch (error) {
    next(error);
  }
};
