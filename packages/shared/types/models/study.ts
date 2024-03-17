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

export interface CreateStudy {
  _id?: Types.ObjectId;
  name?: string;
  description?: string;
  batteries?: Types.ObjectId[];
  sessions?: CreateSession[];
  owner: Types.ObjectId;
}

export interface IStudy extends Required<CreateStudy> {
  sessions: ISession[];
}
