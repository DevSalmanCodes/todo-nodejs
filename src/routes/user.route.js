import express from "express";
import {
  changePassword,
  refreshAccessToken,
  updateUserProfile,
} from "../controllers/user.controller.js";
const router = express.Router();
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").patch(changePassword);
router.route("/update-profile").put(updateUserProfile);
export default router;
