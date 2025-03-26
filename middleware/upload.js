const multer = require('multer');
const path = require('path');

// Configure storage with destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Decide upload destination based on file type
    // For example, you might want different folders for videos and thumbnails
    if (file.mimetype.startsWith('video/')) {
      cb(null, path.join(__dirname, '../uploads/videos'));
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, path.join(__dirname, '../uploads/thumbnails'));
    } else {
      cb(new Error('Unsupported file type.'), null);
    }
  },
  filename: (req, file, cb) => {
    // Prepend a timestamp to the original filename for uniqueness
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Optional: Filter files to restrict upload types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type.'), false);
  }
};

// Create and export the multer instance
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Set a 50MB file size limit
  fileFilter
});

module.exports = upload;
