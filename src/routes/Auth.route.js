import express from "express";
import {
  login,
  logout,
  onBoard,
  signup,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/protectedRoutes.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);

router.post("/onboarding", protectedRoute, onBoard);

//check if user is looged in

router.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
