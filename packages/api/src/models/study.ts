import { Model, Schema, Types, model } from "mongoose";
import ShortUniqueId from "short-unique-id";

export const uid = new ShortUniqueId({ dictionary: "alphanum_lower" });
const serverCodeLength = 5;

import type {
  ISession,
  IStudy,
  IStudyVariant,
  ITaskInstance,
} from "@seitz/shared";
import { generateUniquePrefixServerCode } from "../util/study.utils";

const taskInstanceSchema = new Schema<ITaskInstance>({
  task: {
    type: Schema.Types.ObjectId,
    ref: "CustomizedBattery",
    required: true,
  },
  quantity: { type: Number, required: true, default: 1 },
});

const sessionSchema = new Schema<ISession>({
  name: { type: String, default: "" },
  tasks: [taskInstanceSchema],
});

const variantSchema = new Schema<IStudyVariant>({
  name: { type: String, default: "" },
  sessions: [sessionSchema],
  serverCode: { type: String, default: "" },
  description: { type: String, default: "" },
  tags: { type: [String], default: [] },
  type: { type: String, default: "" },
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
  prefixServerCode: {
    type: String,
    required: true,
    default: () => uid.rnd(3),
    index: true,
    unique: true,
  },
  variants: {
    type: [variantSchema],
    default: [],
  },
  lastModified: { type: Date, default: Date.now },
});

studySchema.pre("save", async function (next) {
  // generate prefixServerCode if it doesn't exist
  if (!this.prefixServerCode) {
    this.prefixServerCode = await generateUniquePrefixServerCode();
  }

  if (this.variants.length === 0) {
    this.variants.push({
      _id: new Types.ObjectId(),
      name: "",
      sessions: [],
      serverCode: "",
      description: "",
      tags: [],
      type: "",
    });
  }

  const existingServerCodes = new Set(
    this.variants.map((variant) => variant.serverCode)
  );

  for (const variant of this.variants) {
    if (!variant.serverCode || variant.serverCode === "") {
      let newServerCode = uid.rnd(serverCodeLength);

      while (
        existingServerCodes.has(newServerCode) ||
        (await Study.exists({ "variants.serverCode": newServerCode }))
      ) {
        newServerCode = uid.rnd(serverCodeLength);
      }
      variant.serverCode = newServerCode;
      existingServerCodes.add(newServerCode);
    }
  }

  next();
});

export const Study = model<IStudy, StudyModelType>("Study", studySchema);
