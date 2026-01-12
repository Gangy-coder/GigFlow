import express from "express";
import Gig from "../models/Gig.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;
  const gigs = await Gig.find({
    status: "open",
    title: new RegExp(q, "i")
  });
  res.json(gigs);
});

router.post("/", auth, async (req, res) => {
  const gig = await Gig.create({ ...req.body, ownerId: req.user.id });
  res.json(gig);
});

export default router;
