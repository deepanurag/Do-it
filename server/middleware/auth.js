import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(401).send("Unauthorized: User not found");
    }
    res.user = user; // Attach user to res object
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(401).send("Unauthorized: Invalid token");
  }
};
