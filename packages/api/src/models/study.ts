import { Schema, Types, model } from "mongoose";

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
  name: { type: String, required: true },
  description: { type: String, required: true },
  batteries: [{ type: Schema.Types.ObjectId, ref: "CustomizedBattery" }],
  sessions: [sessionSchema],
});

export const Study = model<IStudy>("Study", studySchema);
