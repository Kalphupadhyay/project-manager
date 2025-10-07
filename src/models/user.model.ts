import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "crypto";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "https://placehold.co/200x200",
        localPath: "",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgortPasswordTokenExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.password = createHash("sha256").update(this.password).digest("hex");

  next();
});

userSchema.methods.isPasswordCorrect = function (password: string) {
  const hashedPassword = createHash("sha256").update(password).digest("hex");

  if (hashedPassword === this.password) {
    return true;
  }
  return false;
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1d",
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    },
  );
};

userSchema.methods.generateTempToken = function () {
  const unHashedToken = randomBytes(20).toString("hex");
  const hashedToken = createHash("sha256").update(unHashedToken).digest("hex");
  const tokenExpiry = Date.now() + 10 * (60 * 1000); // 10 minutes

  return {
    unHashedToken,
    hashedToken,
    tokenExpiry,
  };
};

export const User = mongoose.model<IUser>("User", userSchema);
