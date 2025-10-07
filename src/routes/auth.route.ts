import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
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

export default router;
