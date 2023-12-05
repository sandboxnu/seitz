import { Schema, Types, model } from "mongoose";

export interface IGenericOption<T> {
  _id?: Types.ObjectId;
  name: string;
  default: T;
}

export interface INumberOption extends IGenericOption<number> {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface ITextOption extends IGenericOption<string> {
  type: "text";
  maxLength?: number;
}

export interface IDropdownOption extends IGenericOption<number> {
  type: "dropdown";
  options: string[];
}

export interface ICheckboxOption extends IGenericOption<boolean> {
  type: "checkbox";
}

export type IOption =
  | INumberOption
  | ITextOption
  | IDropdownOption
  | ICheckboxOption;

export interface IBatteryStage {
  type: string;
  stageLabel: string;
  options: IOption[];
}

export interface IBattery {
  name: string;
  description: string;
  imageUrl: string;
  stages: Types.ObjectId[];
}

const optionSchema = new Schema<IOption>(
  {
    name: { type: String, required: true },
  },
  { discriminatorKey: "type" }
);

const batteryStageSchema = new Schema<IBatteryStage>({
  type: { type: String, required: true },
  stageLabel: String,
  options: [optionSchema],
});

const optArray = batteryStageSchema.path<Schema.Types.DocumentArray>("options");

const numberOptionSchema = new Schema<INumberOption>({
  default: { type: Number, required: true },
  min: Number,
  max: Number,
  step: Number,
});

const textOptionSchema = new Schema<ITextOption>({
  default: { type: String, required: true },
  maxLength: Number,
});

const dropdownOptionSchema = new Schema<IDropdownOption>({
  default: { type: Number, required: true },
  options: [String],
});

const checkboxOptionSchema = new Schema<ICheckboxOption>({
  default: { type: Boolean, required: true },
});

export const NumberOption = optArray.discriminator(
  "number",
  numberOptionSchema
);
export const TextOption = optArray.discriminator("text", textOptionSchema);
export const DropdownOption = optArray.discriminator(
  "dropdown",
  dropdownOptionSchema
);
export const CheckboxOption = optArray.discriminator(
  "checkbox",
  checkboxOptionSchema
);

export const BatteryStage = model<IBatteryStage>(
  "BatteryStage",
  batteryStageSchema
);

export const batterySchema = new Schema<IBattery>({
  name: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  stages: [{ type: Schema.Types.ObjectId, ref: "BatteryStage" }],
});

export const Battery = model<IBattery>("Battery", batterySchema);

export interface IOptionValue {
  option: Types.ObjectId;
  value: unknown;
}

// TODO: Tech Debt - is there a better typing for this?
const optionValueSchema = new Schema<IOptionValue>({
  option: Schema.Types.ObjectId,
  value: Schema.Types.Mixed,
});

export interface ICustomizedBattery {
  battery: Types.ObjectId;
  name: string;
  values: IOptionValue[];
}

export const customizedBatterySchema = new Schema<ICustomizedBattery>({
  battery: { type: Schema.Types.ObjectId, ref: "Battery", required: true },
  name: { type: String, required: true },
  values: [optionValueSchema],
});

export const CustomizedBattery = model<ICustomizedBattery>(
  "CustomizedBattery",
  customizedBatterySchema
);
