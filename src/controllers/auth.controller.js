import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
async function registerController(req, res) {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide required fields",
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });
    user.password = undefined;
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user,
    });
  } catch (err) {
    return res.status(201).json({
      success: false,
      message: "Error while creating account",
      error: err,
    });
  }
}
async function loginController(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);
    
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    const token = jwt.sign({ id: user._id },process.env.JWT_SECRET,{
      expiresIn:"30s"
    });
    console.log(token);
    
    return res.status(200).json(new ApiResponse(200,token,"Logged in successfully"));
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "Error occured",
      err,
    });
  }
}
export { registerController, loginController };
