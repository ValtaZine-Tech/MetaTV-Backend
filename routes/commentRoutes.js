const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Create a comment (authenticated)
router.post('/', auth, commentController.createComment);

// Retrieve comments for a specific video (public)
router.get('/:videoId', commentController.getComments);

// Update a comment (authenticated)
router.put('/:id', auth, commentController.updateComment);

// Delete a comment (authenticated)
router.delete('/:id', auth, commentController.deleteComment);

// Moderate a comment (could be admin/moderator only)
router.put('/moderate/:id', auth, commentController.moderateComment);

module.exports = router;
