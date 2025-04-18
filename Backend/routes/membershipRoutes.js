const express = require('express');
const router = express.Router();
const { 
  inviteMember, 
  removeMember,
  getMembersByClub
} = require('../controllers/membershipController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected Membership Routes
router.post('/:clubId/invite', authMiddleware, inviteMember);
router.delete('/:clubId/members/:memberId', authMiddleware, removeMember);
router.get('/:clubId/members', authMiddleware, getMembersByClub);

module.exports = router;
