import { Schema, model, Document } from "mongoose";
import { IProject } from "../interfaces/project.interface.js";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Project = model<IProject>("Project", projectSchema);
