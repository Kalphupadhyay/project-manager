import { Project } from "../models/project.model";
import { Task } from "../models/task.model";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { title, description, status } = req.body;
  const userId = req.user?._id;

  if (!projectId) {
    throw new Error("Project ID is required in params");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const newTask = await Task.create({
    title,
    projectId,
    description,
    status,
    assignee: userId,
  });

  newTask.save();

  res.status(201).json(
    new ApiResponse({
      data: newTask,
      message: "Task created successfully",
      success: true,
      statusCode: 201,
    }),
  );
});
