const mongoose = require('mongoose');
const slugify = require('slugify');

const ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club must have a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Club name must be less than 50 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Club must have a description'],
    maxlength: [500, 'Description must be less than 500 characters']
  },
  founder: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Club must have a founder']
  },
  members: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  categories: [{
    type: String,
    enum: [
      'Technology', 
      'Arts', 
      'Sports', 
      'Academic', 
      'Cultural', 
      'Social', 
      'Professional'
    ],
    required: [true, 'At least one category is required']
  }],
  privacy: {
    type: String,
    enum: ['PUBLIC', 'PRIVATE'],
    default: 'PUBLIC'
  },
  membershipType: {
    type: String,
    enum: ['OPEN', 'INVITE_ONLY', 'APPLICATION'],
    default: 'OPEN'
  },
  maxMembers: {
    type: Number,
    default: 100,
    validate: {
      validator: function(val) {
        return val > 0;
      },
      message: 'Max members must be a positive number'
    }
  },
  socialLinks: {
    website: String,
    facebook: String,
    twitter: String,
    instagram: String
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for events
ClubSchema.virtual('events', {
  ref: 'Event',
  foreignField: 'club',
  localField: '_id'
});

// Create slug from club name
ClubSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Middleware to limit members
ClubSchema.pre('save', function(next) {
  if (this.members.length > this.maxMembers) {
    throw new Error('Club has reached maximum member limit');
  }
  next();
});

// Static method to check membership
ClubSchema.statics.isMember = async function(clubId, userId) {
  const club = await this.findById(clubId);
  return club.members.includes(userId);
};

module.exports = mongoose.model('Club', ClubSchema);
