import express from "express";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const bid = await Bid.create({
    ...req.body,
    freelancerId: req.user.id
  });
  res.json(bid);
});

router.get("/:gigId", auth, async (req, res) => {
  const bids = await Bid.find({ gigId: req.params.gigId });
  res.json(bids);
});

// Hire Logic
router.patch("/:bidId/hire", auth, async (req, res) => {
  const bid = await Bid.findById(req.params.bidId);

  await Gig.findByIdAndUpdate(bid.gigId, { status: "assigned" });
  await Bid.updateMany({ gigId: bid.gigId }, { status: "rejected" });

  bid.status = "hired";
  await bid.save();

  res.json({ msg: "Hired", bid });
});

export default router;
