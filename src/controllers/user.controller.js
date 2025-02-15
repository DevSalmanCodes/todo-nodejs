import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import {
  uploadOnCloudinary,
  deleteCloudinaryFile,
} from "../utils/cloudinary.js";
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
      new ApiResponse(200, "Access token refreshed successfully", {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
    );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json(new ApiError(401, "Token expired"));
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json(new ApiError(401, "Invalid token"));
    } else {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            err?.message || "Error while refreshing access token"
          )
        );
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
      return res.status(401).json(new ApiError(401, "Incorrect old password"));
    }
    user.password = newPassword;
    await user.save();
    user.password = undefined;
    user.refreshToken = undefined;
    return res
      .status(200)
      .json(new ApiResponse(200, "Paassword changed successfully", user));
  } catch (err) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          err?.message || "Error occurred while changing password"
        )
      );
  }
}

async function updateUserProfile(req, res) {
  const { name, email } = req.body;
  if (!name && !email) {
    return res.status(400).json(new ApiError(400, "Name or email is required"));
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name,
        email: email,
      },
      {
        new: true,
      }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, "Profile updated successfully", user));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, err?.message || "Error while updating profile"));
  }
}

async function getCurrentUser(req, res) {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, "User found successfully", req.user));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, err?.message || "Error while getting user"));
  }
}

async function updateUserAvatar(req, res) {
  try {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      return res.status(400).json(new ApiError(400, "Avatar is required"));
    }
    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    console.log(avatarUrl, avatarLocalPath);

    if (!avatarUrl) {
      return res
        .status(400)
        .json(new ApiError(400, "Error while uploading avatar"));
    }
    const user = await User.findById(req.user?.id);
    await deleteCloudinaryFile(user.avatar.publicId);
    user.avatar = {
      url: avatarUrl.url,
      publicId: avatarUrl.public_id,
    };
    await user.save({ validateBeforeSave: false });
    user.password = undefined;
    user.refreshToken = undefined;
    return res.status(200).json(new ApiResponse(200, "Avatar updated", user));
  } catch (err) {
    return res
      .status(500)
      .json(
        new ApiError(500, err?.message || "Error occured while updating avatar")
      );
  }
}

export {
  refreshAccessToken,
  changePassword,
  updateUserProfile,
  getCurrentUser,
  updateUserAvatar,
};
