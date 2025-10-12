import { Document, Schema } from "mongoose";

// Interface for SubTask document
export interface ISubTask extends Document {
  title: string;
  description: string;
  status: string;
  TaskId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
