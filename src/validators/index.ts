import { body } from "express-validator";

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
      .isEmpty()
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
