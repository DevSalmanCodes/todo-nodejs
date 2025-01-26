import jwt from "jsonwebtoken";
import User from "../models/user.model";
export const verfiyJWT = async (req,_, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new ApiError(400, "Invalid token");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      throw new ApiError(400, "Invalid token");
    }
    const user=await User.findOne({_id:decodedToken.id});
    req.user=user;
  } catch (err) {}
};
