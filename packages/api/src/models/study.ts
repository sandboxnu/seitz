import { Model, Schema, Types, model } from "mongoose";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ dictionary: "alphanum_lower" });
const serverCodeLength = 5;

import type {
  ISession,
  IStudy,
  IStudyVariant,
  ITaskInstance,
} from "@seitz/shared";

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

const variantSchema = new Schema<IStudyVariant>({
  name: { type: String, default: "" },
  sessions: [sessionSchema],
});

interface StudyDocumentProps {
  variants: Types.DocumentArray<IStudyVariant>;
}
type StudyModelType = Model<IStudy, unknown, StudyDocumentProps>;

const studySchema = new Schema<IStudy, StudyModelType>({
  name: { type: String, default: "" },
  description: { type: String, default: "" },
  batteries: [{ type: Schema.Types.ObjectId, ref: "CustomizedBattery" }],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  serverCode: { type: String, unique: true },
  variants: {
    type: [variantSchema],
    default: [],
  },
});

studySchema.pre("save", async function (next) {
  if (this.variants.length === 0) {
    this.variants.push({ _id: new Types.ObjectId(), name: "", sessions: [] });
  }
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

export const Study = model<IStudy, StudyModelType>("Study", studySchema);
