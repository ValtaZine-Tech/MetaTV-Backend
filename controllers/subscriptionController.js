const Subscription = require('../models/Subscription');

// Subscribe to a channel/user
exports.subscribe = async (req, res, next) => {
  try {
    const { channelId } = req.body;
    const existingSubscription = await Subscription.findOne({
      subscriber: req.user.id,
      channel: channelId,
    });

    if (existingSubscription) {
      return res.status(409).json({ message: 'Already subscribed.' });
    }

    const subscription = await Subscription.create({
      subscriber: req.user.id,
      channel: channelId,
    });

    // Optionally trigger a notification (handled by a service)
    res.status(201).json({ subscription });
  } catch (error) {
    next(error);
  }
};

// Unsubscribe
exports.unsubscribe = async (req, res, next) => {
  try {
    const { channelId } = req.body;
    await Subscription.findOneAndDelete({
      subscriber: req.user.id,
      channel: channelId,
    });
    res.status(200).json({ message: 'Unsubscribed successfully.' });
  } catch (error) {
    next(error);
  }
};

// Get subscription notifications (example: new video uploads)
exports.getNotifications = async (req, res, next) => {
  try {
    // This would typically query a Notification model or a service that handles notifications
    // For example purposes, we'll return a stubbed array
    const notifications = [
      { id: 1, message: 'New video uploaded by your subscribed channel.' },
      { id: 2, message: 'Channel X has gone live.' },
    ];
    res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
};
