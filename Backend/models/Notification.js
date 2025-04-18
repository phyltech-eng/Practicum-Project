const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'EVENT_INVITATION',
      'CLUB_INVITATION',
      'EVENT_REMINDER',
      'CLUB_REQUEST',
      'SYSTEM_ALERT',
      'FRIEND_REQUEST',
      'MESSAGE'
    ],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  relatedModel: {
    type: String,
    enum: ['Event', 'Club', 'User', 'Message']
  },
  relatedId: {
    type: mongoose.Schema.ObjectId
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW'
  }
}, {
  timestamps: true
});

// Create index for efficient querying
NotificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
