const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');


const cleanFilePath = (fullPath) => {
  if (!fullPath) return null;
  const parts = fullPath.split(path.sep);
  const uploadsIndex = parts.indexOf('uploads');
  return uploadsIndex !== -1 ? 
    path.join(...parts.slice(uploadsIndex)) : 
    null;
};



// User registration
exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      bio,
      website,
      status,
      accessLevel,
      sendWelcomeEmail,
      requirePasswordChange
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password) {
      // Clean up uploaded file if validation fails
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with all fields
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      avatar: req.file ? cleanFilePath(req.file.path) : null,
      sendWelcomeEmail: sendWelcomeEmail === 'true',
      requirePasswordChange: requirePasswordChange === 'true'
    });

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Remove sensitive data from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      user: userResponse,
      token 
    });

  } catch (error) {
    // Clean up file on error
    if (req.file) fs.unlinkSync(req.file.path);
    next(error);
  }
};

// User login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user and explicitly include the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    // Assuming req.user is set from auth middleware
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    let newAvatarPath = null;

    if (req.file) {
      newAvatarPath = cleanFilePath(req.file.path);
      // Delete old avatar if exists
      if (req.user.avatar) {
        const oldPath = path.join(__dirname, `../${req.user.avatar}`);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updates.avatar = newAvatarPath;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { 
      new: true 
    }).select('-password');

    res.status(200).json({ user });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    next(error);
  }
};



// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    const transformedUsers = users.map(user => ({
      ...user.toObject(),
      avatar: user.avatar ? `${user.avatar}` : null
    }));
    
    res.status(200).json({ users: transformedUsers });
  } catch (error) {
    next(error);
  }
};
