import { ApiResponse } from "../utils/api-response.js";
import { Request, Response } from "express";

export const healthCheck = (_: Request, res: Response) => {
  try {
    const response = new ApiResponse(null, "API is healthy", 200);
    res.status(200).json(response);
  } catch (error) {}
};
