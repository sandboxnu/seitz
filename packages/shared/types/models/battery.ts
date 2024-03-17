import { Types } from "mongoose";

export interface CreateGenericOption<T> {
  _id?: Types.ObjectId;
  name: string;
  default: T;
}

export interface CreateNumberOption extends CreateGenericOption<number> {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface CreateTextOption extends CreateGenericOption<string> {
  type: "text";
  maxLength?: number;
}

export interface CreateDropdownOption extends CreateGenericOption<number> {
  type: "dropdown";
  options: string[];
}

export interface CreateCheckboxOption extends CreateGenericOption<boolean> {
  type: "checkbox";
}

export type CreateOption =
  | CreateNumberOption
  | CreateTextOption
  | CreateDropdownOption
  | CreateCheckboxOption;

export type IOption = Required<CreateOption>;

export interface CreateBatteryStage {
  _id?: Types.ObjectId;
  type: string;
  stageLabel: string;
  options: CreateOption[];
}

export interface IBatteryStage extends Required<CreateBatteryStage> {
  options: IOption[];
}

export interface CreateBattery {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  imageUrl: string;
  stages: Types.ObjectId[];
  deleted?: boolean;
}

export type IBattery = Required<CreateBattery>;

export interface CreateOptionValue {
  _id?: Types.ObjectId;
  option: Types.ObjectId;
  value: unknown;
}

export type IOptionValue = Required<CreateOptionValue>;

export interface CreateCustomizedBattery {
  _id?: Types.ObjectId;
  battery: Types.ObjectId;
  name: string;
  values: CreateOptionValue[];
}

export interface ICustomizedBattery extends Required<CreateCustomizedBattery> {
  values: IOptionValue[];
}
