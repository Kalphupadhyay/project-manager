import { body } from "express-validator";
import { AvailableTaskStatus } from "../utils/constants";

export const taskCreationValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Task title is required")
      .isLength({ max: 100 })
      .withMessage("Task title must be at most 100 characters long"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Task description is required")
      .isLength({ max: 500 })
      .withMessage("Task description must be at most 500 characters long"),
    body("status")
      .optional()
      .isIn(AvailableTaskStatus)
      .withMessage("Status must be one of: " + AvailableTaskStatus.join(", ")),
  ];
};
