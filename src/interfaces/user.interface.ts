import { Document } from "mongoose";

interface IAvatar {
  url?: string;
  localPath?: string;
}

// Interface for the temp token return type
interface ITempToken {
  unHashedToken: string;
  hashedToken: string;
  tokenExpiry: Date;
}

// Interface for User methods
interface IUserMethods {
  isPasswordCorrect(password: string): boolean;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateTempToken(): ITempToken;
}

// Interface for User document properties
export interface IUser extends Document, IUserMethods {
  avatar: IAvatar;
  username: string;
  email: string;
  fullName?: string;
  password: string;
  isEmailVerified: boolean;
  refreshToken?: string;
  forgotPasswordToken?: string;
  forgortPasswordTokenExpiry?: Date;
  emailVerificationToken?: string;
  emailVerificationTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}
