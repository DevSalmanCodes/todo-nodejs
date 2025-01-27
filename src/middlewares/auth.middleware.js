import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

async function isAuthorizedUser(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.id).select("-password -refreshToken");
    if (!user) {
      return res.status(401).json({ error: "Unauthorized user" });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
}

export default isAuthorizedUser;
