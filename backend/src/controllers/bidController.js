import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import mongoose from 'mongoose';

export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ error: 'Gig is not open for bidding' });
    }

    if (gig.ownerId.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot bid on your own gig' });
    }

    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user.id
    });

    if (existingBid) {
      return res.status(400).json({ error: 'You already bid on this gig' });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id,
      message,
      price
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGigBids = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const bids = await Bid.find({ gigId: gig._id })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id })
      .populate('gigId', 'title description budget status')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const hireFreelancer = async (req, res) => {
  try {
    console.log('Hiring freelancer for bid:', req.params.bidId);
    
    const { bidId } = req.params;
    
    // Find bid
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Find gig
    const gig = await Gig.findById(bid.gigId);
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Check ownership
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check gig status
    if (gig.status === 'assigned') {
      return res.status(400).json({ error: 'Gig already assigned' });
    }

    // Update in sequence (not atomic, but works)
    gig.status = 'assigned';
    await gig.save();

    // Reject other bids
    await Bid.updateMany(
      { 
        gigId: gig._id,
        _id: { $ne: bidId }
      },
      { status: 'rejected' }
    );

    // Hire selected bid
    bid.status = 'hired';
    await bid.save();

    // Populate data
    await bid.populate('freelancerId', 'name email');

    res.json({ 
      success: true, 
      message: 'Freelancer hired successfully',
      gig,
      bid
    });

  } catch (error) {
    console.error('Hire error:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};