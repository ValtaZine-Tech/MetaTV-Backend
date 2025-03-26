const Comment = require('../models/Comment');

// Create a comment
exports.createComment = async (req, res, next) => {
  try {
    const { videoId, text } = req.body;
    const comment = await Comment.create({
      video: videoId,
      user: req.user.id,
      text,
    });
    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

// Read comments for a video
exports.getComments = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    const comments = await Comment.find({ video: videoId }).populate('user', 'username');
    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

// Update a comment
exports.updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const { text } = req.body;

    // Optionally check if req.user.id matches comment's author
    const updatedComment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });
    res.status(200).json({ comment: updatedComment });
  } catch (error) {
    next(error);
  }
};

// Delete a comment
exports.deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    // Optionally check user permissions here
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// Moderate a comment (e.g., flag or remove inappropriate content)
exports.moderateComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const { action } = req.body; // e.g., "approve", "reject"
    // Implement moderation logic based on your business rules
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    // Example: mark comment as flagged or approved
    comment.status = action === 'approve' ? 'approved' : 'rejected';
    await comment.save();

    res.status(200).json({ comment });
  } catch (error) {
    next(error);
  }
};
