const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const app = express();
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middleware
const errorMiddleware = require('./middleware/error');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:8081', // Changed from PORT to CLIENT_URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true // If using cookies/tokens
  }));

// Swagger setup
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler (should be last middleware)
app.use(errorMiddleware);


// Export app for testing or reuse
module.exports = app;