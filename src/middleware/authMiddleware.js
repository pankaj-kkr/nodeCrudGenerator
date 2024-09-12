const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'Unauthorized - No Token' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: 'Forbidden - Invalid Token' });
    req.user = user.data;
    next();
  });
};

const restrict = (roles = [], checkOwnership = false, Model) => {
  return async (req, res, next) => {
    console.log('lloged in user id -- ', req.user.id, req.user.roleName);
    try {
      const user = await User.findByPk(req.user.id, {
        include: User.associations.role,
      });

      if (!user || !roles.includes(user.role.name) || !user.isActive) {
        return res
          .status(403)
          .json({ message: 'You are not authorized to access that route' });
      }

      if (checkOwnership) {
        const resourceId = req.params.id;
        const userId = req.user.id;

        const resource = await Model.findByPk(resourceId);

        if (!resource) {
          return res.status(404).json({ message: 'Resource not found' });
        }

        // console.log(user.role.name, Model === User, resource.id, userId);
        if (
          user.role.name != 'Admin' &&
          (Model == User ? resource.id != userId : resource.userId != userId)
        ) {
          return res.status(403).json({
            message: 'You are not authorized to perform that action',
          });
        }
      }

      next();
    } catch (error) {
      console.error('Error checking user status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = { authMiddleware, restrict };
