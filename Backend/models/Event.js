const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: String,
  eventType: {
    type: String,
    enum: ['ONLINE', 'OFFLINE', 'HYBRID'],
    default: 'OFFLINE'
  },
  maxParticipants: Number,
  registrationDeadline: Date,
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'],
    default: 'DRAFT'
  },
  requiredDocuments: [String],
  registrationFee: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
