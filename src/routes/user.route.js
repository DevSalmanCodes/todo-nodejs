import express from "express";
import {
  changePassword,
  getCurrentUser,
  refreshAccessToken,
  updateUserAvatar,
  updateUserProfile,
} from "../controllers/user.controller.js";
import isAuthorizedUser from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").patch(isAuthorizedUser, changePassword);
router.route("/update-profile").put(isAuthorizedUser, updateUserProfile);
router.route("/get-profile").get(isAuthorizedUser, getCurrentUser);
router.route("/update-avatar").patch(isAuthorizedUser,upload.single("avatar"), updateUserAvatar);
export default router;
