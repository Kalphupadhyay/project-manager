import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let err = error;

  console.log(err);

  // If it's not an ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    err = new ApiError(statusCode, message, [], error.stack);
  }

  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
    });
  }

  // Send error response
  const response = {
    success: false,
    message: err.message,
    statusCode: err.statusCode,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    ...(err.errors?.length > 0 && { errors: err.errors }),
  };

  res.status(err.statusCode).json(response);
};

export { errorHandler };
