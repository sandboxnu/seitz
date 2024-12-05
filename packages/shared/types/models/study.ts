import { Types } from "mongoose";

export interface CreateTaskInstance {
  _id?: Types.ObjectId;
  task: Types.ObjectId;
  quantity?: number;
}
export type ITaskInstance = Required<CreateTaskInstance>;

export interface CreateSession {
  _id?: Types.ObjectId;
  name: string;
  tasks: CreateTaskInstance[];
}

export interface ISession extends Required<CreateSession> {
  tasks: ITaskInstance[];
}

export interface CreateStudyVariant {
  _id?: Types.ObjectId;
  name: string;
  sessions: CreateSession[];
  serverCode: string;
}

export interface IStudyVariant extends Required<CreateStudyVariant> {
  sessions: ISession[];
}

export interface CreateStudy {
  _id?: Types.ObjectId;
  name?: string;
  description?: string;
  batteries?: Types.ObjectId[];
  owner: Types.ObjectId;
  variants: CreateStudyVariant[];
}

export interface IStudy extends Required<CreateStudy> {
  variants: IStudyVariant[];
}

export interface CreateOptionValue {
  _id?: Types.ObjectId;
  option: Types.ObjectId;
  value: unknown;
}

export type IOptionValue = Required<CreateOptionValue>;

export interface CreateCustomizedSession {
  _id?: Types.ObjectId;
  battery: Types.ObjectId;
  name: string;
  values: CreateOptionValue[];
}

export interface ICustomizedSession extends Required<CreateCustomizedSession> {
  values: IOptionValue[];
}
