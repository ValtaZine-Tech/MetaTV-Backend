const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const path = require('path');

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
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Expose-Headers', 'Content-Disposition');
  }
}));

// Global error handler (should be last middleware)
app.use(errorMiddleware);


// Export app for testing or reuse
module.exports = app;