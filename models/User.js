const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 30
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'channel'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  channelDetails: {
    name: String,
    description: String,
    bannerImage: String,
    totalSubscribers: {
      type: Number,
      default: 0
    },
    socialLinks: {
      website: String,
      facebook: String,
      twitter: String
    }
  },
  subscriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  isVerified: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model('User', userSchema);