import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.json({ msg: "User created", user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const found = await User.findOne({ email });
  if (!found) return res.status(400).json({ msg: "Invalid credentials" });

  const ok = await bcrypt.compare(password, found.password);
  if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: found._id, email }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({ msg: "Logged in", user: found });
});

router.post("/logout", async (_req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out" });
});

export default router;
