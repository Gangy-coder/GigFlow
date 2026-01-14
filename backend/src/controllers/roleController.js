import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Switch user role
export const switchRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!role || !['employer', 'freelancer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize availableRoles if not present (for old users)
    if (!user.availableRoles) {
      user.availableRoles = ['freelancer', 'employer'];
    }

    // Check if user has this role available
    if (!user.availableRoles.includes(role)) {
      return res.status(403).json({ 
        error: 'Role not available for this user',
        availableRoles: user.availableRoles 
      });
    }

    // Switch to new role
    user.currentRole = role;
    // Also update the legacy role field for backward compatibility
    user.role = role;
    
    await user.save();
    
    // Generate new token with updated role
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.currentRole,
        availableRoles: user.availableRoles 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      success: true,
      message: `Switched to ${role} mode`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.currentRole,
        availableRoles: user.availableRoles
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's available roles
export const getAvailableRoles = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('availableRoles currentRole role');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize if not present
    if (!user.availableRoles) {
      user.availableRoles = ['freelancer', 'employer'];
      user.currentRole = user.role || 'freelancer';
      await user.save();
    }

    res.json({
      availableRoles: user.availableRoles,
      currentRole: user.currentRole || user.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};