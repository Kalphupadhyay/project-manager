import { asyncHandler } from "../utils/async-handler.js";
import { Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";
import { emailVerificationEmailGenContent, sendEmail } from "../utils/mail.js";
import { ApiResponse } from "../utils/api-response.js";

const generateRefreshTokenAccessToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();
    user!.refreshToken = refreshToken;
    user?.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const newUser = await User.create({
      email,
      username,
      password,
    });

    const { hashedToken, tokenExpiry, unHashedToken } =
      newUser.generateTempToken();
    newUser.emailVerificationToken = hashedToken;
    newUser.emailVerificationTokenExpiry = tokenExpiry;
    await newUser.save({ validateBeforeSave: false });

    await sendEmail({
      email: newUser.email,
      subject: "Verify your email",
      mailgenContent: emailVerificationEmailGenContent(
        newUser.username,
        `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
      ),
    });

    const createdUser = await User.findById(newUser._id).select(
      "-password -__v -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgortPasswordTokenExpiry -refreshToken",
    );

    if (!createdUser) {
      throw new ApiError(500, "Internal Server Error");
    }

    res.status(201).json(
      new ApiResponse({
        data: createdUser,
        message: "User registered successfully. Please verify your email",
        statusCode: 201,
        success: true,
      }),
    );
  },
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateRefreshTokenAccessToken(
    user._id as string,
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse({
        data: { accessToken, refreshToken },
        message: "User logged in successfully",
        statusCode: 200,
        success: true,
      }),
    );
});
