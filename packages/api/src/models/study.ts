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

export interface CreateOptionValue {
  _id?: Types.ObjectId;
  option: Types.ObjectId;
  value: unknown;
}

export type IOptionValue = Required<CreateOptionValue>;

// TODO: Tech Debt
const optionValueSchema = new Schema<IOptionValue>({
  option: Schema.Types.ObjectId,
  value: Schema.Types.Mixed,
});

export const customizedSessionSchema = new Schema<ICustomizedSession>({
  battery: { type: Schema.Types.ObjectId, ref: "Battery", required: true },
  name: { type: String, required: true },
  values: [optionValueSchema],
});

export const CustomizedSession = model<ICustomizedSession>(
  "CustomizedBattery",
  customizedSessionSchema
);

export interface CreateCustomizedSession {
  _id?: Types.ObjectId;
  battery: Types.ObjectId;
  name: string;
  values: CreateOptionValue[];
}

export interface ICustomizedSession extends Required<CreateCustomizedSession> {
  values: IOptionValue[];
}

const variantSchema = new Schema<IStudyVariant>({
  name: { type: String, default: "" },
  sessions: [{ type: Schema.Types.ObjectId, ref: "CustomizedBattery" }], // is this right?
  serverCode: { type: String },
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
  variants: {
    type: [variantSchema],
    default: [],
  },
});

studySchema.pre("save", async function (next) {
  if (this.variants.length === 0) {
    this.variants.push({
      _id: new Types.ObjectId(),
      name: "",
      sessions: [],
      serverCode: "",
    });
  }
  next();
});

variantSchema.pre("save", async function (next) {
  if (!this.serverCode || this.serverCode === "") {
    this.serverCode = uid.rnd(serverCodeLength);

    let study = await Study.findOne({
      "variants.serverCode": this.serverCode,
    });
    while (study) {
      this.serverCode = uid.rnd(serverCodeLength);
      study = await Study.findOne({
        "variants.serverCode": this.serverCode,
      });
    }
  }
  next();
});

export const Study = model<IStudy, StudyModelType>("Study", studySchema);

const sessionSchema = new Schema<ISession>({
  name: { type: String, required: true },
  tasks: [taskInstanceSchema],
});

export const Session = model<ISession>("Session", sessionSchema);
