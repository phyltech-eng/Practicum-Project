const Notification = require('../models/Notification');
const ErrorMiddleware = require('../middleware/errorMiddleware');

class NotificationController {
  // Get User Notifications
  static async getUserNotifications(req, res, next) {
    try {
      const notifications = await Notification.find({
        recipient: req.user._id
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username email')
      .populate('relatedId');

      const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false
      });

      res.status(200).json({
        status: 'success',
        unreadCount,
        results: notifications.length,
        data: {
          notifications
        }
      });
    } catch (error) {
      next(ErrorMiddleware.createError(error.message, 400));
    }
  }

  // Mark Notifications as Read
  static async markNotificationsRead(req, res, next) {
    try {
      const { notificationIds } = req.body;

      // If no specific IDs provided, mark all as read
      const filter = notificationIds 
        ? { _id: { $in: notificationIds }, recipient: req.user._id }
        : { recipient: req.user._id, isRead: false };

      await Notification.updateMany(
        filter,
        { isRead: true },
        { multi: true }
      );

      res.status(200).json({
        status: 'success',
        message: 'Notifications marked as read'
      });
    } catch (error) {
      next(ErrorMiddleware.createError(error.message, 400));
    }
  }

  // Create Notification (Static Method)
  static async createNotification(data) {
    try {
      return await Notification.create(data);
    } catch (error) {
      console.error('Notification Creation Error:', error);
      return null;
    }
  }

  // Delete Old Notifications
  static async cleanupNotifications(req, res, next) {
    try {
      // Delete notifications older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await Notification.deleteMany({
        recipient: req.user._id,
        createdAt: { $lt: thirtyDaysAgo }
      });

      res.status(200).json({
        status: 'success',
        message: `Deleted ${result.deletedCount} old notifications`
      });
    } catch (error) {
      next(ErrorMiddleware.createError(error.message, 400));
    }
  }
}

module.exports = NotificationController;
