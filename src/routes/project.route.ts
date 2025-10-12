import { Router } from "express";
import { createProject } from "../controllers/project.controller";
import { jwtVerify } from "../middlewares/authentication.middleware";
import { projectCreationValidator } from "../validators";
import { validate } from "../middlewares/validator.middleware";

const router = Router();

router.post(
  "/",
  projectCreationValidator(),
  validate,
  jwtVerify,
  createProject,
);

export default router;
