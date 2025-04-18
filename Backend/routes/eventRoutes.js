const express = require('express');
const EventController = require('../controllers/eventController');
const AuthMiddleware = require('../middleware/authMiddleware');
const ErrorMiddleware = require('../middleware/errorMiddleware');

const router = express.Router();

// Protect all routes
router.use(AuthMiddleware.protect);

// Event Routes
router.route('/')
  .post(ErrorMiddleware.catchAsync(EventController.createEvent))
  .get(ErrorMiddleware.catchAsync(EventController.getAllEvents));

router.route('/:id')
  .get(ErrorMiddleware.catchAsync(EventController.getEvent))
  .patch(ErrorMiddleware.catchAsync(EventController.updateEvent));

// Event Registration Routes
router.post(
  '/:id/register', 
  ErrorMiddleware.catchAsync(EventController.registerEvent)
);

router.post(
  '/:id/unregister', 
  ErrorMiddleware.catchAsync(EventController.unregisterEvent)
);

module.exports = router;
