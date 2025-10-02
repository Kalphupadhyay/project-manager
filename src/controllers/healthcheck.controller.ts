import { ApiResponse } from "../utils/api-response.js";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";

export const healthCheck = asyncHandler((_: Request, res: Response) => {
  const response = new ApiResponse(
    {
      data: { status: "OK" },
      message: "Server is running",
      statusCode: 200,
      success: true
    }
  );
  res.status(200).json(response);
});
