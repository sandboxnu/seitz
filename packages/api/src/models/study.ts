import { Schema, Types, model } from "mongoose";
import { ICustomizedBattery, customizedBatterySchema } from "./battery";

export interface ITaskInstance {
  task: Types.ObjectId;
  quantity: number;
}

export interface ISession {
  name: string;
  activities: ITaskInstance[];
}

export interface IStudy {
  name: string;
  description: string;
  batteries: ICustomizedBattery[];
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
  activities: [taskInstanceSchema],
});

const studySchema = new Schema<IStudy>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  batteries: [customizedBatterySchema],
  sessions: [sessionSchema],
});

const Study = model<IStudy>("Study", studySchema);

export default Study;
