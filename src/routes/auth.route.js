import express from "express";
import {
  registerUser,
  loginUser,
  verifyOtp,
  sendOtp,
  logoutUser,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/verify-otp").post(verifyOtp);
router.route("/send-otp").post(sendOtp);
router.route("/logout").post(logoutUser);
export default router;
