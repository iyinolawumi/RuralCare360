const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Protect Route (must be logged in) ────────────────
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorised, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();

  } catch (error) {
    res.status(401).json({ message: 'Not authorised, token failed' });
  }
};

// ── Role-Based Access Control ─────────────────────────
exports.authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role '${req.user.role}' is not authorised to access this route` 
      });
    }
    next();
  };
};