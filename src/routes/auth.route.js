import express from "express";
import { registerUser, loginUser, verifyOtp, sendOtp } from "../controllers/auth.controller.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-otp").post(verifyOtp);
router.route("/send-otp").post(sendOtp);
export default router;
