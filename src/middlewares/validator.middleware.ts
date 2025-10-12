import { ApiError } from "../utils/api-error.js";
import e, { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const errors = validationResult(req);
  console.log(errors);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: { [key: string]: string }[] = [];
  errors.array().map((err) => extractedErrors.push({ [err.type]: err.msg }));
  throw new ApiError(422, "Validation Error", extractedErrors);
};
