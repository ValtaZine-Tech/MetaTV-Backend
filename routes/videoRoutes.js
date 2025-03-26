const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Video upload (authenticated, file upload middleware)
router.post('/upload', auth, upload.single('video'), videoController.uploadVideo);

// Video approval (could be restricted to admin/moderator)
router.put('/approve/:id', auth, videoController.approveVideo);

// Video streaming (no auth required for public streaming, adjust as needed)
router.get('/stream/:id', videoController.streamVideo);

// Video search (public endpoint)
router.get('/search', videoController.searchVideos);

module.exports = router;
