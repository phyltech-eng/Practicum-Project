const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const { 
  authMiddleware, 
  checkPermission 
} = require('../middleware/authMiddleware');
const { 
  clubCreationValidationRules, 
  validate 
} = require('../utils/validation');

// Authenticated routes
router.use(authMiddleware);

// Club CRUD Routes
router.post(
  '/', 
  checkPermission(['create:club']),
  validate(clubCreationValidationRules),
  clubController.createClub
);

router.get(
  '/', 
  checkPermission(['read:clubs']),
  clubController.getAllClubs
);

router.get(
  '/:id', 
  checkPermission(['read:club']),
  clubController.getClubById
);

router.patch(
  '/:id', 
  checkPermission(['update:club']),
  clubController.updateClub
);

router.delete(
  '/:id', 
  checkPermission(['delete:club']),
  clubController.deleteClub
);

// Club Membership Routes
router.post(
  '/:id/join', 
  checkPermission(['request:join']),
  clubController.requestToJoinClub
);

router.patch(
  '/:clubId/requests/:requestId', 
  checkPermission(['manage:members']),
  clubController.handleJoinRequest
);

module.exports = router;
