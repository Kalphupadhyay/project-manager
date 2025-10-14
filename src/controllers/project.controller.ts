import { Project } from "../models/project.model";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
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

    res.status(200).json(
      new ApiResponse({
        data: projects,
        message: "Projects retrieved successfully",
        statusCode: 200,
        success: true,
      }),
    );
  },
);

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId).populate(
    "createdBy",
    "email",
  );
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  res.status(200).json(
    new ApiResponse({
      data: project,
      message: "Project retrieved successfully",
      statusCode: 200,
      success: true,
    }),
  );
});

export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { name, description } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }
    if (req.user.role !== "admin") {
      throw new ApiError(403, "Only admins can update projects");
    }
    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();
    const updatedProject = await Project.findById(projectId).populate(
      "createdBy",
      "email",
    );

    res.status(200).json({
      success: true,
      data: updatedProject,
    });
  },
);

export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }
    if (req.user.role !== "admin") {
      throw new ApiError(403, "Only admins can delete projects");
    }
    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  },
);
