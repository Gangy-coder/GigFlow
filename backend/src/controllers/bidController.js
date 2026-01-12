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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;
    
    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Bid not found' });
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user.id) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (gig.status === 'assigned') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Gig already assigned' });
    }

    gig.status = 'assigned';
    await gig.save({ session });

    await Bid.updateMany(
      { 
        gigId: gig._id,
        _id: { $ne: bidId }
      },
      { status: 'rejected' },
      { session }
    );

    bid.status = 'hired';
    await bid.save({ session });

    await session.commitTransaction();
    
    if (req.io) {
      req.io.to(bid.freelancerId.toString()).emit('hired', {
        gigTitle: gig.title,
        message: `You have been hired for "${gig.title}"!`
      });
    }

    res.json({ 
      success: true, 
      message: 'Freelancer hired successfully',
      gig,
      bid
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};