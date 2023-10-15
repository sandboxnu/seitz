import { Schema, Types, model } from "mongoose";

export interface ISession {
  activities: Types.ObjectId[];
}

export interface IStudy {
  title: string;
  sessions: ISession[];
}

const sessionSchema = new Schema<ISession>({
  activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
});

const studySchema = new Schema<IStudy>({
  title: { type: String, required: true },
  sessions: [sessionSchema],
});

const Study = model<IStudy>("Study", studySchema);

export default Study;
