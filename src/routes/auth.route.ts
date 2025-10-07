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

router.post("/register", userRegistrationValidator(), validate, registerUser);
router.post("/login", loginValidator(), validate, loginUser);
router.get("/logout", jwtVerify, logoutUser);
router.get("/current-user", jwtVerify, getCurrentUser);
router.post("/change-password", jwtVerify, changePassword);
router.post("/refresh-token", jwtVerify, getRefreshToken);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-email-verification", resendEmailVerification);
router.post("/forgot-password", forgotPasswordVerification);
router.post("/reset-password/:token", resetPassword);

export default router;
