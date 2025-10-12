import { Document, Schema } from "mongoose";

// Interface for Project document
export interface IProject extends Document {
  name: string;
  description: string;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
