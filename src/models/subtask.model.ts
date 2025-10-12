import { Schema, model } from "mongoose";
import { AvailableTaskStatus } from "../utils/constants.js";
import { ISubTask } from "../interfaces/subtask.interface.js";

export const subTaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: AvailableTaskStatus,
      default: AvailableTaskStatus[0],
    },
    TaskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SubTask = model<ISubTask>("SubTask", subTaskSchema);
