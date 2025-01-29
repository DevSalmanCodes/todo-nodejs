import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import validateUser from "../validations/userValidation.js";

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
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json(new ApiError(400, error.details[0].message));
  }
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json(new ApiError(400, "Please provide required fields"));
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json(new ApiError(400, "User already exists"));
    }
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });
    user.refreshToken = undefined;
    user.password = undefined;
    return res
      .status(201)
      .json(new ApiResponse(201, "Account created successfully", user));
  } catch (err) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          err?.message || "Error occured while creating account"
        )
      );
  }
}

// send
async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json(new ApiError(400, "Incorrect password"));
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
export { registerUser, loginUser };
