import jwt from "jsonwebtoken";

const loggedInUsers = new Set();

export const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach user ID to request for further use
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
