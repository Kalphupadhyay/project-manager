import { Project } from "../models/project.model";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";

export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const createdBy = req.user._id;

    if (req.user.role !== "admin") {
      throw new ApiError(403, "Only admins can create projects");
    }

    const project = await Project.create({ name, description, createdBy });
    project.save();
    const newProject = await Project.findById(project._id)
      .select("-__v")
      .populate("createdBy", "email");

    res.status(201).json({
      success: true,
      data: newProject,
    });
  },
);

export const getAllProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const projects = await Project.find().populate("createdBy", "name email");
    res.status(200).json({
      success: true,
      data: projects,
    });
  },
);
