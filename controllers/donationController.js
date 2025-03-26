const Donation = require('../models/Donation');
const paymentService = require('../services/paymentService');

// Process a donation payment
exports.processDonation = async (req, res, next) => {
  try {
    const { amount, paymentMethod, recipientId } = req.body;

    // Process the payment using paymentService
    const paymentResult = await paymentService.processPayment({
      amount,
      paymentMethod,
      donorId: req.user.id,
      recipientId,
    });

    if (!paymentResult.success) {
      return res.status(400).json({ message: 'Payment failed.', details: paymentResult.error });
    }

    // Record the donation
    const donation = await Donation.create({
      donor: req.user.id,
      recipient: recipientId,
      amount,
      transactionId: paymentResult.transactionId,
    });

    res.status(200).json({ donation });
  } catch (error) {
    next(error);
  }
};

// Get donation history for a user
exports.getDonationHistory = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user.id });
    res.status(200).json({ donations });
  } catch (error) {
    next(error);
  }
};
