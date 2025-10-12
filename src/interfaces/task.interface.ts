import { Document, Schema } from "mongoose";

// Interface for Task document
export interface ITask extends Document {
  title: string;
  description: string;
  assignee: Schema.Types.ObjectId;
  status: string;
  projectId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
