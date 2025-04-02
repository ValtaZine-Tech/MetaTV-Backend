const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email address']
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'creator', 'moderator', 'user', 'channel'],
    default: 'user'
  },
  bio: String,
  website: String,
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'pending'
  },
  accessLevel: {
    type: String,
    enum: ['standard', 'restricted', 'full'],
    default: 'standard'
  },
  sendWelcomeEmail: Boolean,
  requirePasswordChange: Boolean,
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
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);