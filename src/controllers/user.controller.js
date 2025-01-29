import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

async function refreshAccessToken(req, res) {
  const incomingRefreshToken = req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json(new ApiError(401, "Unauthorized request"));
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_SECRET
    );

    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }
    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    if (user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    res.json(
      new ApiResponse(
        200,
        "Access token refreshed successfully",
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        }
      )
    );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json(new ApiError(401, "Token expired"));
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json(new ApiError(401, "Invalid token"));
    } else {
      return res
        .status(500)
        .json(new ApiError(500,err?.message || "Internal server error"));
    }
  }
}

async function changePassword(req, res) {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json(new ApiError(400, "Old and new password is required"));
  }
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json(new ApiError(401, "Incorrect old password"));
    }
    user.password = newPassword;
    await user.save();
    user.password = undefined;
    user.refreshToken = undefined;
    return res
      .status(200)
      .json(new ApiResponse(200, "Paassword changed successfully", user));
  } catch (err) {
    return res.status(500).json(new ApiError(500,err?.message || "Internal server error"));
  }
}

export { refreshAccessToken, changePassword };
