import { Router } from "express";
import { createTask } from "../controllers/task.controller.js";
import { jwtVerify } from "../middlewares/authentication.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { taskCreationValidator } from "../validators/task.validator.js";

const router = Router();

router.post(
  "/:projectId",
  taskCreationValidator(),
  validate,
  jwtVerify,
  createTask,
);

export default router;
