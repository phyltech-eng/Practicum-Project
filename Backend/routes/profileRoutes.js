const express = require('express');
const ProfileController = require('../controllers/profileController');
const AuthMiddleware = require('../middleware/authMiddleware');
const ErrorMiddleware = require('../middleware/errorMiddleware');
const ValidationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

// Protect all routes in this router
router.use(AuthMiddleware.protect);

// Update Profile Route
router.patch(
  '/update', 
  ValidationMiddleware.validate,
  ErrorMiddleware.catchAsync(ProfileController.updateProfile)
);

// Change Password Route
router.patch(
  '/change-password',
  [
    // Add password change validation
    ValidationMiddleware.validate
  ],
  ErrorMiddleware.catchAsync(ProfileController.changePassword)
);

module.exports = router;
