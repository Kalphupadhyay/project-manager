import { body } from "express-validator";

export const projectCreationValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Project name is required")
      .isLength({ max: 100 })
      .withMessage("Project name must be at most 100 characters long"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Project description is required")
      .isLength({ max: 500 })
      .withMessage("Project description must be at most 500 characters long"),
  ];
};
