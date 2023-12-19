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
  console.log(email);
  console.log(name);
  console.log(password);
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
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      // Create a new user
      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        tokens: [],
      });

      await newUser.save();

      // Return success response
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
  const email = res.user.email;
  //const { remainloggingtime } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // user.remainloggingtime = remainloggingtime;
    // const currentTime = new Date().toLocaleTimeString();
    // user.lastLogin = currentTime;
    await user.save();

    res.clearCookie("token", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    });
    // res.clearCookie("recentLogin", {
    //   httpOnly: true,
    //   expires: new Date(0),
    //   secure: true,
    //   sameSite: "none",
    // });
    res.status(200).json({ message: "Cookies removed." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loggedIn = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log(req.headers);
    if (!token) {
      return res.json(false);
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    const rootUser = await UserModel.findOne({
      _id: verifyToken.id,
      "tokens.token": token,
    });

    if (rootUser) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invaldsfsfid token" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
