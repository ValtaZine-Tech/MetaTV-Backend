const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createDirectories = () => {
  const directories = [
    path.join(__dirname, '../uploads/videos'),
    path.join(__dirname, '../uploads/images'),
    path.join(__dirname, '../uploads/music')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
createDirectories();

// Configure storage with destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';
    if (file.mimetype.startsWith('video/')) {
      folder += 'videos';
    } else if (file.mimetype.startsWith('image/')) {
      folder += 'images';
    } else if (file.mimetype.startsWith('audio/')) {
      folder += 'music';
    } else {
      return cb(new Error('Unsupported file type.'), null);
    }
    
    // Verify directory exists synchronously
    const fullPath = path.join(__dirname, `../${folder}`);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Prepend the folder structure to filename
    cb(null, `images/${uniqueSuffix}-${cleanName}`); // Changed here
  }
});

// Enhanced file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'video/mp4', 'video/quicktime',
    'image/jpeg', 'image/png', 'image/webp',
    'audio/mpeg', 'audio/wav'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Unsupported file type'), false);
  }
};

// Create and export the multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 5 // Max number of files per upload
  },
  fileFilter
});

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? 'File size too large' 
        : err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

module.exports = { upload, handleUploadErrors };