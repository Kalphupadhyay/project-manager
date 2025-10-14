import { asyncHandler } from "../utils/async-handler.js";
import { CookieOptions, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  emailVerificationEmailGenContent,
  forgotPasswordTokenEmailGenContent,
  sendEmail,
} from "../utils/mail.js";
import { ApiResponse } from "../utils/api-response.js";
import { createHash } from "crypto";

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
    const { email, username, password, role } = req.body;

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
      role,
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
        `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`,
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
    throw new ApiError(400, "Invalid email or password");
  }

  const isPasswordCorrect = user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateRefreshTokenAccessToken(
    user._id as string,
  );

  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .cookie("isLoggedIn", true, {
      ...options,
      httpOnly: false,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse({
        data: { accessToken, refreshToken },
        message: "User logged in successfully",
        statusCode: 200,
        success: true,
      }),
    );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    },
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .clearCookie("isLoggedIn")
    .json(
      new ApiResponse({
        data: null,
        message: "User logged out successfully",
        statusCode: 200,
        success: true,
      }),
    );
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const user = await User.findById(userId).select(
      "-password -__v -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgortPasswordTokenExpiry -refreshToken",
    );
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.status(200).json(
      new ApiResponse({
        data: user,
        message: "User fetched successfully",
        statusCode: 200,
        success: true,
      }),
    );
  },
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Old password is incorrect");
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json(
      new ApiResponse({
        data: null,
        message: "Password changed successfully",
        statusCode: 200,
        success: true,
      }),
    );
  },
);

export const getRefreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!oldRefreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }
    try {
      const decodedRefreshToken = jwt.verify(
        oldRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
      );

      var userId = (decodedRefreshToken as { _id: string })._id;

      const user = await User.findById(userId).select(
        "-password -__v -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgortPasswordTokenExpiry -refreshToken",
      );

      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      if (user.refreshToken !== oldRefreshToken) {
        throw new ApiError(401, "Refesh token expired");
      }

      let { refreshToken, accessToken } = await generateRefreshTokenAccessToken(
        userId as string,
      );
      user.refreshToken = refreshToken;
      await user.save();

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
            data: { accessToken: refreshToken, user },
            message: "Access token generated successfully",
            statusCode: 200,
            success: true,
          }),
        );
    } catch (error) {
      throw new ApiError(401, "Invalid refresh token");
    }
  },
);

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  const hashedToken = createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json(
    new ApiResponse({
      data: null,
      message: "Email verified successfully",
      statusCode: 200,
      success: true,
    }),
  );
});

export const resendEmailVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.isEmailVerified) {
      throw new ApiError(400, "Email is already verified");
    }

    const { hashedToken, tokenExpiry, unHashedToken } =
      user.generateTempToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      subject: "Verify your email",
      mailgenContent: emailVerificationEmailGenContent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`,
      ),
    });

    res.status(200).json(
      new ApiResponse({
        data: null,
        message: "Verification email sent successfully",
        statusCode: 200,
        success: true,
      }),
    );
  },
);

export const forgotPasswordVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isEmailVerified) {
      throw new ApiError(400, "Email is not verified");
    }

    const { hashedToken, tokenExpiry, unHashedToken } =
      user.generateTempToken();

    user.forgotPasswordToken = hashedToken;
    user.forgortPasswordTokenExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      subject: "Reset your password",
      mailgenContent: forgotPasswordTokenEmailGenContent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${unHashedToken}`,
      ),
    });

    res.status(200).json(
      new ApiResponse({
        data: null,
        message: "Password reset email sent successfully",
        statusCode: 200,
        success: true,
      }),
    );
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const hashedToken = createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgortPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired token");
    }
    user.password = newPassword;
    user.forgotPasswordToken = undefined;
    user.forgortPasswordTokenExpiry = undefined;
    await user.save();
    res.status(200).json(
      new ApiResponse({
        data: null,
        message: "Password reset successfully",
        statusCode: 200,
        success: true,
      }),
    );
  },
);
