import { Schema, model } from "mongoose";

export interface IActivity {
  name: string;
  quantity: number;
}

export interface ISession {
  activities: IActivity[];
}

export interface IStudy {
  title: string;
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
  title: { type: String, required: true },
  sessions: [sessionSchema],
});

const Study = model<IStudy>("Study", studySchema);

export default Study;
