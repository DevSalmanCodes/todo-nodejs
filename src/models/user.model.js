import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});
userSchema.methods.comparePassword = async function (plainPassword) {
  const isMatch = await bcrypt.compare(plainPassword, this.password);
  return isMatch;
};
userSchema.methods.generateAccessToken=async function (userId){
  return jwt.sign(userId,process.env.JWT_SECRET,{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY=function (userId){
      return jwt.sign(userId,process.env.JWT_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
      })
    }
  });

}
userSchema.methods.generatedRefres
const User = mongoose.model("User", userSchema);

export default User;
