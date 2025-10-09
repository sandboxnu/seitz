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
  prefixServerCode: string;
  variants: CreateStudyVariant[];
  lastModified?: Date;
}

export interface IStudy extends Required<CreateStudy> {
  variants: IStudyVariant[];
}
