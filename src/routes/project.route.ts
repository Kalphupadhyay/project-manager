import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProject,
  updateProject,
} from "../controllers/project.controller";
import { jwtVerify } from "../middlewares/authentication.middleware";
import { validate } from "../middlewares/validator.middleware";
import { projectCreationValidator } from "../validators/project.validator";

const router = Router();

router.post(
  "/",
  projectCreationValidator(),
  validate,
  jwtVerify,
  createProject,
);
router.get("/", jwtVerify, getAllProjects);
router.get("/:projectId", jwtVerify, getProject);
router.put("/:projectId", jwtVerify, updateProject);
router.delete("/:projectId", jwtVerify, deleteProject);

export default router;
