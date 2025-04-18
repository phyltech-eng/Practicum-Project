const express = require('express');
const NotificationController = require('../controllers/notificationController');
const AuthMiddleware = require('../middleware/authMiddleware');
const ErrorMiddleware = require('../middleware/errorMiddleware');

const router = express.Router();

// Protect all routes
router.use(AuthMiddleware.protect);

// Get User Notifications
router.get(
  '/', 
  ErrorMiddleware.catchAsync(NotificationController.getUserNotifications)
);

// Mark Notifications as Read
router.patch(
  '/mark-read', 
  ErrorMiddleware.catchAsync(NotificationController.markNotificationsRead)
);

// Cleanup Old Notifications
router.delete(
  '/cleanup', 
  ErrorMiddleware.catchAsync(NotificationController.cleanupNotifications)
);

module.exports = router;
