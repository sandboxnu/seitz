import { Types } from "mongoose";

export interface IGenericOption<T> {
  name: string;
  default: T;
}

export interface INumberOption extends IGenericOption<number> {
  type: "number";
  min: number;
  max: number;
  step: number;
}

export interface ITextOption extends IGenericOption<string> {
  type: "text";
  maxLength: number;
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

export interface IOptionValue<T> {
  option: IGenericOption<T> & IOption;
  value: T;
}

export interface ICompleteBattery {
  battery: Types.ObjectId;
  values: { optionId: Types.ObjectId; value: unknown }[];
}

// const optionSchema = new Schema<IOption>({
//   name: String,

// });

// const batterySchema = new Schema<IBattery>({
//   name: String,
//   description: String,
//   imageUrl: String,
//   options: []
// })
