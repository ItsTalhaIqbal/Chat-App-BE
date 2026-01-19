import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { insertData } from "../config/stream.js";
//signup
export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be atleast 6 digets" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exist , please use dufferent one" });
    }

    const index = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.run/public/${index}.png`;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPass,
      fullname,
      randomAvatar,
    });

    try {
      await insertData({
        id: newUser._id.toString(),
        name: newUser.fullname,
        image: newUser.profilepic || "",
      });
      console.log("stream user created");
    } catch (error) {
      console.log("stram User creating error", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 40 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ sucess: true, user: newUser });
  } catch (error) {
    console.log("error in the signup controller", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    user.password = undefined;

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("login controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//logout
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout Successful" });
};
