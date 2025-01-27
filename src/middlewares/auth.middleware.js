import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

async function isAuthorizedUser(req, _, next)  {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new ApiError(400, "Invalid token");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
    
    if (!decodedToken) {
      throw new ApiError(400, "Unautorized user");
    }
    const user = await User.findById(decodedToken.id)
    req.user = user;
    next();
  } catch (err) {
   throw new ApiError(400,err);
  }
};

export default isAuthorizedUser;
