import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};
