import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  loginValidator,
  userRegistrationValidator,
} from "../validators/index.js";

const router = Router();

router.post("/register", userRegistrationValidator(), validate, registerUser);
router.post("/login", loginValidator(), validate, loginUser);

export default router;
