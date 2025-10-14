import { Router } from "express";
import {
  changePassword,
  forgotPasswordVerification,
  getCurrentUser,
  getRefreshToken,
  loginUser,
  logoutUser,
  registerUser,
  resendEmailVerification,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  loginValidator,
  userRegistrationValidator,
} from "../validators/index.js";
import { jwtVerify } from "../middlewares/authentication.middleware.js";

const router = Router();

// unsecure routes
router.post("/register", userRegistrationValidator(), validate, registerUser);
router.post("/login", loginValidator(), validate, loginUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPasswordVerification);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token", getRefreshToken);

// secure routes
router.get("/logout", jwtVerify, logoutUser);
router.get("/current-user", jwtVerify, getCurrentUser);
router.post("/change-password", jwtVerify, changePassword);
router.post("/resend-email-verification", resendEmailVerification);

export default router;
