import express from "express";
import { changePassword, refreshAccessToken } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/refresh-token", refreshAccessToken);
router.patch("/change-password",changePassword)

export default router;