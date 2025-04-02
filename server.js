require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const User = require('./models/User'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Define the port from environment variables or fallback to 5000
const PORT = process.env.PORT || 5049;

// Connect to MongoDB
connectDB();

// Function to create a default admin account
const createDefaultAdmin = async () => {
  try {
    // Check if an admin account already exists
    const existingAdmin = await User.findOne({ role: 'super-admin' });
    if (existingAdmin) {
      logger.info('Super Admin account already exists.');
      return;
    }

    // Create a default admin account
    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'admin123', 10);
    const admin = new User({
      firstName: 'System',
      lastName: 'Administrator',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      role: 'super-admin',
      status: 'active',
      isVerified: true,
    });

    await admin.save();
    logger.info('Default admin account created successfully.');
  } catch (error) {
    logger.error('Error creating default admin account:', error);
  }
};

// Call the function after the database connection is established
connectDB().then(() => {
  createDefaultAdmin();
});

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown on unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Add SIGINT handler for CTRL+C shutdown
process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});