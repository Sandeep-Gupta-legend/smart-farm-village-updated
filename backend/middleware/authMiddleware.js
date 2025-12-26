// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Access Denied',
        message: 'No token provided. Please login first.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
    
    // Verify user still exists and is active
    const user = await User.findById(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({ 
        error: 'User not found or deactivated',
        message: 'Please login again.' 
      });
    }

    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token Expired',
        message: 'Your session has expired. Please login again.' 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid Token',
        message: 'Invalid or corrupted token. Please login again.' 
      });
    }
    res.status(401).json({ 
      error: 'Authentication Failed',
      message: 'Authentication failed. Please login again.' 
    });
  }
};

// Check if user is seller
const isSeller = (req, res, next) => {
  if (req.user.user_type !== 'seller') {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Only sellers can access this resource.' 
    });
  }
  next();
};

// Check if user is buyer
const isBuyer = (req, res, next) => {
  if (req.user.user_type !== 'buyer') {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Only buyers can access this resource.' 
    });
  }
  next();
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Only administrators can access this resource.' 
    });
  }
  next();
};

// Check if user owns the resource
const ownsResource = (paramName = 'userId') => {
  return (req, res, next) => {
    const resourceUserId = req.params[paramName];
    if (resourceUserId !== req.userId) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'You do not have permission to access this resource.' 
      });
    }
    next();
  };
};

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      user_type: user.user_type,
      email: user.email
    },
    process.env.JWT_SECRET || 'default_secret_key',
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

module.exports = {
  verifyToken,
  isSeller,
  isBuyer,
  isAdmin,
  ownsResource,
  generateToken
};
