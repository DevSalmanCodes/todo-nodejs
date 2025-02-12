import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import validateUser from "../validations/userValidation.js";
import sendEmail from "../utils/email.js";

async function generateAccessAndRefreshToken(userId) {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
}
async function registerUser(req, res) {
  const { name, email, password } = req.body;
  const { error } = validateUser(req.body, "register");
  if (error) {
    return res.status(400).json(new ApiError(400, error.details[0].message));
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json(new ApiError(400, "User already exists"));
    }
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });

    const otp = await sendEmail(email);
    user.emailOtp = otp;
    await user.save();
    user.refreshToken = undefined;
    user.password = undefined;
    return res
      .status(201)
      .json(
        new ApiResponse(201, "OTP sent!, please verify before login", user)
      );
  } catch (err) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          err?.message || "Error occured while creating an account"
        )
      );
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const { error } = validateUser(req.body, "login");
  if (error) {
    return res.status(400).json(new ApiError(400, error.details[0].message));
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json(new ApiError(400, "Incorrect password"));
    }
    if (!user.isEmailVerified) {
      return res.status(401).json(new ApiError(401, "Email not verified"));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    user.refreshToken = undefined;
    return res.status(200).json(
      new ApiResponse(
        200,
        "Logged in successfully",

        { accessToken: accessToken, refreshToken: refreshToken }
      )
    );
  } catch (err) {
    return res
      .status(404)
      .json(
        new ApiError(500, err?.message || "Error occured while logging in")
      );
  }
}

async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json(new ApiError(400, "Email and otp is required"));
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    if (user.emailOtp !== otp ) {
      return res.status(400).json(new ApiError(400, "Invalid otp"));
    }
    
    if(Date.now() > user.otpExpiry){
      return res.status(400).json(new ApiError(400, "Otp expired"));
    }
    user.emailOtp = null;
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Email verified!"));
  } catch (err) {
    return res
      .status(500)
      .json(
        new ApiError(500, err?.message || "Error occured while verifying otp")
      );
  }
}

async function sendOtp(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(new ApiError(400, "Please provide email"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    const otp = await sendEmail(email);
    user.emailOtp = otp;
    user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Otp sent!"));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, "Error occured while sending otp"));
  }
}
export { registerUser, loginUser, verifyOtp, sendOtp };
