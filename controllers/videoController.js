const Video = require('../models/Video');
// Assuming you have a videoService to handle file uploads and streaming logic
const videoService = require('../services/videoService');

// Upload a video
exports.uploadVideo = async (req, res, next) => {
  try {
    // req.file could be populated by your upload middleware
    const videoData = {
      title: req.body.title,
      description: req.body.description,
      filePath: req.file.path,
      uploadedBy: req.user.id,
      status: 'pending', // default status
    };

    const video = await Video.create(videoData);
    res.status(201).json({ video });
  } catch (error) {
    next(error);
  }
};

// Approval flow (admin or moderator approves the video)
exports.approveVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findByIdAndUpdate(videoId, { status: 'approved' }, { new: true });
    res.status(200).json({ video });
  } catch (error) {
    next(error);
  }
};

// Video streaming endpoint
exports.streamVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    // Use videoService to stream video (could involve range requests)
    videoService.stream(videoId, req, res);
  } catch (error) {
    next(error);
  }
};

// Search videos
exports.searchVideos = async (req, res, next) => {
  try {
    const { query } = req.query;
    // Basic search implementation, can be expanded with full-text search etc.
    const videos = await Video.find({ title: { $regex: query, $options: 'i' } });
    res.status(200).json({ videos });
  } catch (error) {
    next(error);
  }
};
