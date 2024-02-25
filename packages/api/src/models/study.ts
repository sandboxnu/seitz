import { Schema, Types, model } from "mongoose";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ dictionary: "alphanum_lower" });
const serverCodeLength = 5;

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
  owner: Types.ObjectId;
  serverCode: string;
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
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  serverCode: { type: String, unique: true },
});

studySchema.pre("save", async function (next) {
  if (!this.serverCode) {
    this.serverCode = uid.rnd(serverCodeLength);

    let study = await Study.findOne({ serverCode: this.serverCode });
    while (study) {
      this.serverCode = uid.rnd(serverCodeLength);
      study = await Study.findOne({ serverCode: this.serverCode });
    }
  }
  next();
});
export const Study = model<IStudy>("Study", studySchema);
