import { body } from "express-validator";
import { AvailableUserRoles } from "../utils/constants";

export const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("fullName")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Full name must be at most 50 characters long"),
    body("role")
      .trim()
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRoles) // Fixed: use isIn() to check if value exists in array
      .withMessage(`Role must be one of: ${AvailableUserRoles.join(", ")}`),
  ];
};

export const loginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

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
