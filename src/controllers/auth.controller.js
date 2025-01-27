import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";

async function generateAccessAndRefreshToken(userId) {
  try {
    const user = await User.findById(userId);
    
    
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
   user.refreshToken=refreshToken;
   user.save({validateBeforeSave:false});    
    return { accessToken, refreshToken };
  } catch (err) {
    throw err?.message;
  }
}
async function registerUser(req, res) {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Please provide required fields"));
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json(new ApiResponse(400, "User already exists"));
    }
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });
    user.password = undefined;
    return res
      .status(201)
      .json(new ApiResponse(201, "User created successfully", {}, user));
  } catch (err) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "Error occured while creating account",
          err?.message
        )
      );
  }
}
async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiResponse(400, "All fields are required"));
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json(new ApiResponse(400, "Incorrect password"));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    console.log(accessToken);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Logged in successfully",
          {},
          { accessToken: accessToken, refreshToken: refreshToken }
        )
      );
  } catch (err) {
    return res
      .status(404)
      .json(
        new ApiResponse(500, "Error occured while logging in", err?.message)
      );
  }
}
export { registerUser, loginUser };
