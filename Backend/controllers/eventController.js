const Event = require('../models/Event');
const Club = require('../models/Club');
const ErrorMiddleware = require('../middleware/errorMiddleware');
const APIFeatures = require('../utils/apiFeatures');

class EventController {
  // Create a new event
  static async createEvent(req, res, next) {
    try {
      // Verify club membership
      const club = await Club.findById(req.body.club);
      if (!club) {
        return next(ErrorMiddleware.createError('Club not found', 404));
      }

      // Check if user is a member of the club
      if (!club.members.includes(req.user._id)) {
        return next(ErrorMiddleware.createError('You must be a club member to create an event', 403));
      }

      // Create event
      const eventData = {
        ...req.body,
        organizer: req.user._id,
        status: 'PUBLISHED' // Automatically publish if user is club member
      };

      const newEvent = await Event.create(eventData);

      res.status(201).json({
        status: 'success',
        data: {
          event: newEvent
        }
      });
    } catch (error) {
      next(ErrorMiddleware.createError(error.message, 400));
    }
  }

  // Get all events with advanced filtering
  static async getAllEvents(req, res, next) {
    try {
      // Create query object with advanced features
      const features = new APIFeatures(Event.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const events = await features.query.populate({
        path: 'club',
        select: 'name slug'
      }).populate({
        path: 'organizer',
        select: 'username email'
      });

      const totalEvents = await Event.countDocuments();

      res.status(200).json({
        status: 'success',
        results: events.length,
        totalEvents,
        data: {
          events
        }
      });
    } catch (error) {
      next(ErrorMiddleware.createError(error.message, 400));
    }
  }

  // Get single event by ID
  static async getEvent(req, res, next) {
    try {
      const event = await Event.findById(req.params.id)
        .populate({
          path: 'club',
          select: 'name description'
        })
        .populate({
          path: 'organizer',
          select: 'username email'
        })
        .populate({
          path: 'registeredParticipants',
          select: 'username email'
        });

      if (!event) {
        return next(ErrorMiddleware.createError('No event found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          event
        }
      });
    } catch (error) {
      next(ErrorMiddleware.createError(error.message, 400));
    }
  }

  // Register for an event
  static async registerEvent(req, res, next) {
    try {
      const event = await Event.findById(req.params.id);

      // Check event registration conditions
      if (!event.isRegistrationOpen) {
        return next(ErrorMiddleware.createError('Event registration is closed', 400));
      }

      // Check if user is already registered
      if (event.registeredParticipants.includes(req.user._id)) {
        return next(ErrorMiddleware.createError('You are already registered for this event', 400));
      }

      // Add user to registered participants
      event.registeredParticipants.push(req.user._id);
      await event.save();

      res.status(200).json({
        status: 'success',
        message: 'Successfully registered for the event',
        data: {
          event
        }
      });
    } catch (error) {
      next(ErrorMiddleware.createError(error.message, 400));
    }
  }

  // Unregister from an event
  static async unregisterEvent(req, res, next) {
    try {
      const event = await Event.findById(req.params.id);

      // Remove user from registered participants
      event.registeredParticipants = event.registeredParticipants.filter(
        participantId => participantId.toString() !== req.user._id.toString()
      );

      await event.save();

      res.status(200).json({
        status: 'success',
        message: 'Successfully unregistered from the event',
        data: {
          event
        }
      });
    } catch (error) {
      next(ErrorMiddleware.createError(error.message, 400));
    }
  }

  // Update event
  static async updateEvent(req, res, next) {
    try {
      const event = await Event.findById(req.params.id);

      // Check if user is the organizer
      if (event.organizer.toString() !== req.user._id.toString()) {
        return next(ErrorMiddleware.createError('You are not authorized to update this event', 403));
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { 
          new: true, 
          runValidators: true 
        }
      );

      res.status(200).json({
        status: 'success',
        data: {
          event: updatedEvent
        }
      });
    } catch (error) {
      next(ErrorMiddleware.createError(error.message, 400));
    }
  }
}

module.exports = EventController;
