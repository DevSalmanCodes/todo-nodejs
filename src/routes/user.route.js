import express from "express";
import {
  changePassword,
  refreshAccessToken,
} from "../controllers/user.controller.js";
const router = express.Router();
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").patch(changePassword);

export default router;
