const User = require('../models/User');
const ErrorMiddleware = require('../middleware/errorMiddleware');

class ProfileController {
  // Update User Profile
  static async updateProfile(req, res, next) {
    const { firstName, lastName, bio } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        req.user._id, 
        { 
          profile: {
            firstName: firstName || req.user.profile.firstName,
            lastName: lastName || req.user.profile.lastName,
            bio: bio || req.user.profile.bio
          }
        },
        { 
          new: true,  // Return updated document
          runValidators: true  // Run model validations
        }
      );

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profile: user.profile
          }
        }
      });
    } catch (error) {
      next(ErrorMiddleware.createError(error.message, 400));
    }
  }

  // Change Password
  static async changePassword(req, res, next) {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
      // Find user and check current password
      const user = await User.findById(req.user._id).select('+password');

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return next(ErrorMiddleware.createError('Current password is incorrect', 401));
      }

      // Validate new password
      if (newPassword !== confirmPassword) {
        return next(ErrorMiddleware.createError('New passwords do not match', 400));
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.status(200).json({
        status: 'success',
        message: 'Password updated successfully'
      });
    } catch (error) {
      next(ErrorMiddleware.createError(error.message, 400));
    }
  }
}

module.exports = ProfileController;
