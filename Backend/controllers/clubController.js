const Club = require('../models/Club');
const User = require('../models/User');
const { AppError } = require('../middleware/errorMiddleware');
const { catchAsync } = require('../middleware/errorMiddleware');
const APIFeatures = require('../Utils/searchFilter');
const NotificationService = require('../services/notificationService');
const { logger } = require('../Utils/logger');

class ClubController {
  // Create a new club
  createClub = catchAsync(async (req, res, next) => {
    const { name, description, categories, privacy } = req.body;

    // Check if club with same name already exists
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return next(new AppError('A club with this name already exists', 400));
    }

    // Create club
    const club = await Club.create({
      name,
      description,
      founder: req.user._id,
      categories,
      privacy,
      members: [req.user._id],
      leaders: [req.user._id]
    });

    // Log club creation
    logger.info(`Club created: ${club.name} by ${req.user.username}`);

    // Send notification
    await NotificationService.sendEmail(
      req.user.email,
      'Club Created Successfully',
      `Your club ${club.name} has been created.`
    );

    res.status(201).json({
      status: 'success',
      data: { club }
    });
  });

  // Get all clubs with advanced filtering
  getAllClubs = catchAsync(async (req, res, next) => {
    // Advanced query building
    const features = new APIFeatures(Club.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const clubs = await features.query
      .populate('founder', 'username email')
      .populate('members', 'username');

    res.status(200).json({
      status: 'success',
      results: clubs.length,
      data: { clubs }
    });
  });

  // Get specific club details
  getClubById = catchAsync(async (req, res, next) => {
    const club = await Club.findById(req.params.id)
      .populate('founder', 'username email')
      .populate('members', 'username email')
      .populate('leaders', 'username email');

    if (!club) {
      return next(new AppError('No club found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { club }
    });
  });

  // Update club details
  updateClub = catchAsync(async (req, res, next) => {
    const { name, description, categories, privacy } = req.body;

    // Find the club and check permissions
    const club = await Club.findById(req.params.id);
    if (!club) {
      return next(new AppError('No club found with that ID', 404));
    }

    // Check if user is a leader
    if (!club.leaders.includes(req.user._id)) {
      return next(new AppError('You are not authorized to update this club', 403));
    }

    // Update club
    club.name = name || club.name;
    club.description = description || club.description;
    club.categories = categories || club.categories;
    club.privacy = privacy || club.privacy;

    await club.save();

    res.status(200).json({
      status: 'success',
      data: { club }
    });
  });

  // Delete a club
  deleteClub = catchAsync(async (req, res, next) => {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return next(new AppError('No club found with that ID', 404));
    }

    // Check if user is the founder
    if (club.founder.toString() !== req.user._id.toString()) {
      return next(new AppError('Only the founder can delete the club', 403));
    }

    await club.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

  // Join club request
  requestToJoinClub = catchAsync(async (req, res, next) => {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return next(new AppError('No club found with that ID', 404));
    }

    // Check if user is already a member
    if (club.members.includes(req.user._id)) {
      return next(new AppError('You are already a member of this club', 400));
    }

    // Check if request already exists
    const existingRequest = club.joinRequests.find(
      request => request.user.toString() === req.user._id.toString()
    );

    if (existingRequest) {
      return next(new AppError('You have already sent a join request', 400));
    }

    // Add join request
    club.joinRequests.push({
      user: req.user._id,
      status: 'PENDING'
    });

    await club.save();

    // Notify club leaders
    const leaders = await User.find({ _id: { $in: club.leaders } });
    for (const leader of leaders) {
      await NotificationService.sendEmail(
        leader.email,
        'New Club Join Request',
        `${req.user.username} has requested to join ${club.name}`
      );
    }

    res.status(200).json({
      status: 'success',
      message: 'Join request sent successfully'
    });
  });

  // Approve or reject join request
  handleJoinRequest = catchAsync(async (req, res, next) => {
    const { clubId, requestId } = req.params;
    const { status } = req.body;

    const club = await Club.findById(clubId);

    if (!club) {
      return next(new AppError('No club found with that ID', 404));
    }

    // Check if user is a leader
    if (!club.leaders.includes(req.user._id)) {
      return next(new AppError('You are not authorized to handle join requests', 403));
    }

    const joinRequest = club.joinRequests.id(requestId);

    if (!joinRequest) {
      return next(new AppError('Join request not found', 404));
    }

    joinRequest.status = status;

    if (status === 'APPROVED') {
      club.members.push(joinRequest.user);
    }

    await club.save();

    // Notify user about request status
    const user = await User.findById(joinRequest.user);
    await NotificationService.sendEmail(
      user.email,
      'Club Join Request Status',
      `Your request to join ${club.name} has been ${status.toLowerCase()}`
    );

    res.status(200).json({
      status: 'success',
      message: 'Join request processed successfully'
    });
  });
}

module.exports = new ClubController();
