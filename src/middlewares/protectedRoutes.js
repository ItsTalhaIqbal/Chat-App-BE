import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Token Not Found" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return (res.status(401), json({ message: "Invalid Token" }));
    }

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unautherized user not found" });
    }

    req.user = user;
    console.log(user._id);

    next();
  } catch (error) {
    console.log("error in protected route ", error);
    res.status(500).json({ message: "inetrnal server error" });
  }
};
