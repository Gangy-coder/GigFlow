import User from '../models/User.js';
import Gig from '../models/Gig.js';
import Bid from '../models/Bid.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const postedGigs = await Gig.countDocuments({ ownerId: user._id });
    const submittedBids = await Bid.countDocuments({ freelancerId: user._id });
    const hiredProjects = await Bid.countDocuments({ 
      freelancerId: user._id, 
      status: 'hired' 
    });

    res.json({
      user,
      stats: {
        postedGigs,
        submittedBids,
        hiredProjects
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    
    await user.save();
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};