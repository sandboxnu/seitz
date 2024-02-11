import { Schema, Types, model } from "mongoose";
import { IUser, User } from "./user";

export interface ITaskInstance {
  task: Types.ObjectId;
  quantity: number;
}

export interface ISession {
  name: string;
  tasks: ITaskInstance[];
}

export interface IStudy {
  name: string;
  description: string;
  batteries: Types.ObjectId[];
  sessions: ISession[];
  owner: IUser;
}

const taskInstanceSchema = new Schema<ITaskInstance>({
  task: {
    type: Schema.Types.ObjectId,
    ref: "CustomizedBattery",
    required: true,
  },
  quantity: { type: Number, required: true, default: 1 },
});

const sessionSchema = new Schema<ISession>({
  name: { type: String, required: true },
  tasks: [taskInstanceSchema],
});

const studySchema = new Schema<IStudy>({
  name: { type: String, default: "" },
  description: { type: String, default: "" },
  batteries: [{ type: Schema.Types.ObjectId, ref: "CustomizedBattery" }],
  sessions: [sessionSchema],
  owner: { type: User, required: true },
});

export const Study = model<IStudy>("Study", studySchema);
