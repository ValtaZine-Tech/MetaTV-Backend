const fs = require('fs');
const Video = require('../models/Video');
const path = require('path');

/**
 * Streams a video file supporting HTTP range requests.
 * Expects the video document to contain a filePath field.
 * @param {string} videoId - The ID of the video.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.stream = async (videoId, req, res) => {
  try {
    // Retrieve the video document to get the file path
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found.' });
    }

    const videoPath = path.resolve(video.filePath);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Parse Range header for partial video streaming
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4', // Adjust content type if needed
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // No range header, stream the entire video file
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
