import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  price: Number,
  status: { type: String, default: "pending" } // pending | hired | rejected
});

export default mongoose.model("Bid", bidSchema);
