import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

async function isAuthorizedUser(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json(new ApiResponse(401, "Unauthorized user"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(401).json(new ApiResponse(401, "Unauthorized user"));
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json(new ApiResponse(401, "Token expired"));
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json(ApiResponse(401, "Invalid token"));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, "Internal server error", err?.message));
    }
  }
}

export default isAuthorizedUser;
