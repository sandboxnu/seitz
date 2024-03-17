import { Model, Schema, Types, model } from "mongoose";
import type { ISession, IStudy, ITaskInstance } from "@seitz/shared";

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

interface StudyDocumentProps {
  sessions: Types.DocumentArray<ISession>;
}
type StudyModelType = Model<IStudy, unknown, StudyDocumentProps>;

const studySchema = new Schema<IStudy, StudyModelType>({
  name: { type: String, default: "" },
  description: { type: String, default: "" },
  batteries: [{ type: Schema.Types.ObjectId, ref: "CustomizedBattery" }],
  sessions: [sessionSchema],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Study = model<IStudy, StudyModelType>("Study", studySchema);
