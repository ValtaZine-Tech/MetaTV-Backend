const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../middleware/auth');

// Process a donation (authenticated)
router.post('/donate', auth, donationController.processDonation);

// Get donation history (authenticated)
router.get('/history', auth, donationController.getDonationHistory);

module.exports = router;
