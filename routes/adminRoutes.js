const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// These routes should be further protected with admin authorization checks.

// Moderate content (video/comment)
router.put('/moderate', auth, adminController.moderateContent);

// Get analytics data
router.get('/analytics', auth, adminController.getAnalytics);

// Manage user account (update or delete)
router.put('/user/:userId', auth, adminController.manageUser);
router.delete('/user/:userId', auth, adminController.manageUser);

module.exports = router;
