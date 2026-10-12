/**
 * Restrict endpoint access strictly to admin users
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden: Admin access required for this action.',
  });
};

/**
 * Restrict endpoint access to registered users (user or admin)
 */
const registeredOnly = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden: You must be registered and logged in to perform this action.',
  });
};

module.exports = { adminOnly, registeredOnly };
