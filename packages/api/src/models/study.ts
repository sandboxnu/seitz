import { Schema, model } from "mongoose";

export interface IActivity {
  name: string;
  quantity: number;
}

export interface ISession {
  activities: IActivity[];
}

export interface IStudy {
  name: string;
  description?: string;
  sessions: ISession[];
}

const activitySchema = new Schema<IActivity>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const sessionSchema = new Schema<ISession>({
  activities: [activitySchema],
});

const studySchema = new Schema<IStudy>({
  name: { type: String, required: true },
  description: String,
  sessions: [sessionSchema],
});

const Study = model<IStudy>("Study", studySchema);

export default Study;
