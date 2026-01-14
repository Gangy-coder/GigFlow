import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user with both legacy and new fields
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.currentRole || user.role, // Use currentRole first
      availableRoles: user.availableRoles || ['freelancer', 'employer']
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export { auth }