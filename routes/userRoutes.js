const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { upload, handleUploadErrors } = require('../middleware/upload');

// Public routes
router.post('/register', 
    upload.single('avatar'), 
    handleUploadErrors, // Add error handling
    userController.register
  );
router.post('/login', userController.login);

// Protected routes
router.get('/', auth, userController.getAllUsers);
router.put('/profile', 
    upload.single('avatar'), // Add avatar update capability
    handleUploadErrors,
    userController.updateProfile
  );

module.exports = router;
