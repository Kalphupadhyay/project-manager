import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { User } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const jwtVerify = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token =
      req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    try {
      let decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      );
      const user = await User.findById(
        (decodedToken as { _id: string })._id,
      ).select(
        "-password -__v -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgortPasswordTokenExpiry -refreshToken",
      );
      if (!user) {
        throw new ApiError(401, "Unauthorized request");
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid Token");
    }
  },
);
