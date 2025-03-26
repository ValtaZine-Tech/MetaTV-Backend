const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

// Subscribe to a channel/user (authenticated)
router.post('/subscribe', auth, subscriptionController.subscribe);

// Unsubscribe (authenticated)
router.post('/unsubscribe', auth, subscriptionController.unsubscribe);

// Get subscription notifications (authenticated)
router.get('/notifications', auth, subscriptionController.getNotifications);

module.exports = router;
