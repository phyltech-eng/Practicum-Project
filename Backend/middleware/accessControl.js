const { AppError } = require('../utils/AppError');

// Role-based access control
const ROLES = {
  CLUB_ADMIN: ['read:club', 'write:club', 'delete:club'],
  MEMBER: ['read:club', 'write:limited'],
  GUEST: ['read:public']
};

const checkPermission = (requiredPermissions) => {
  return (req, res, next) => {
    // Assuming user roles are set in authentication middleware
    const userRoles = req.user.roles || [];
    
    const hasPermission = userRoles.some(role => 
      requiredPermissions.every(permission => 
        ROLES[role]?.includes(permission)
      )
    );

    if (!hasPermission) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

// Specific permission checks
const canCreateClub = checkPermission(['write:club']);
const canDeleteClub = checkPermission(['delete:club']);
const canManageMembers = checkPermission(['write:club']);

module.exports = {
  checkPermission,
  canCreateClub,
  canDeleteClub,
  canManageMembers
};
