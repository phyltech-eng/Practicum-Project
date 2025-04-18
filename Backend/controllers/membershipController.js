const Club = require('../models/Club');
const User = require('../models/User');

exports.inviteMember = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { email } = req.body;

    // Find club
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if user is club leader
    if (!club.leaders.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find user by email
    const invitedUser = await User.findOne({ email });
    if (!invitedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a member
    if (club.members.includes(invitedUser._id)) {
      return res.status(400).json({ message: 'User already in club' });
    }

    // Add user to club members
    club.members.push(invitedUser._id);
    await club.save();

    // Add club to user's clubs
    invitedUser.clubs.push(clubId);
    await invitedUser.save();

    res.json({ 
      message: 'Member invited successfully', 
      club 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error inviting member', 
      error: error.message 
    });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { clubId, memberId } = req.params;

    // Find club
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if user is club leader
    if (!club.leaders.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Remove member from club
    club.members = club.members.filter(
      member => member.toString() !== memberId
    );
    await club.save();

    // Remove club from user's clubs
    await User.findByIdAndUpdate(memberId, {
      $pull: { clubs: clubId }
    });

    res.json({ 
      message: 'Member removed successfully', 
      club 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error removing member', 
      error: error.message 
    });
  }
};

exports.getMembersByClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    // Find club and populate members
    const club = await Club.findById(clubId)
      .populate('members', 'username email profile')
      .populate('leaders', 'username email profile');

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json({
      members: club.members,
      leaders: club.leaders
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching members', 
      error: error.message 
    });
  }
};
