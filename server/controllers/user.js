import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "Empty fields",
      message: {
        email: "This field is required",
        password: "This field is required",
      },
    });
  }
  try {
    const existinguser = await UserModel.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User don't Exist." });
    }

    const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    existinguser.tokens.push({ token });
    await existinguser.save();
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_API);
    res.setHeader("Access-Control-Expose-Headers", "Authorization");

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
    });
    res.status(200).json({ isLoggedIn: true, token });
  } catch (error) {
    res.status(200).json({ message: "Something went worng..." });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({
      error: "Empty fields",
      message: {
        name: "This field is required",
        email: "This field is required",
        password: "This field is required",
      },
    });
  }
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        tokens: [],
      });
      await newUser.save();
      res.status(200).json({ result: newUser });
    } catch (error) {
      console.error("Error during user creation:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error during user creation." });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};

export const logout = async (req, res) => {
  const { email } = res.user;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    await user.save();
    res.clearCookie("token", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    });
    console.log(`User ${email} logged out successfully.`);
    return res
      .status(200)
      .json({ message: "Logout successful. Cookies removed." });
  } catch (error) {
    console.error("Error during logout:", error);
    return res
      .status(500)
      .json({ message: "Failed to logout. Internal server error." });
  }
};

export const loggedIn = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json(false);
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    const rootUser = await UserModel.findOne({
      _id: verifyToken.id,
      "tokens.token": token,
    });
    if (rootUser) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Unauthorized: Token has expired");
    }
    res.status(401).send("Unauthorized: No token provided or invalid token");
    console.log(err);
  }
};
