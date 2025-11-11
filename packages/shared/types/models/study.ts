export interface CreateTaskInstance {
  _id?: string;
  task: string;
  quantity?: number;
}
export type ITaskInstance = Required<CreateTaskInstance>;

export interface CreateSession {
  _id?: string;
  name: string;
  tasks: CreateTaskInstance[];
}

export interface ISession extends Required<CreateSession> {
  tasks: ITaskInstance[];
}

export interface CreateStudyVariant {
  _id?: string;
  name: string;
  sessions: CreateSession[];
  serverCode: string;
}

export interface IStudyVariant extends Required<CreateStudyVariant> {
  sessions: ISession[];
}

export interface CreateStudy {
  _id?: string;
  name?: string;
  description?: string;
  batteries?: string[];
  owner: string;
  prefixServerCode: string;
  variants: CreateStudyVariant[];
  lastModified?: Date;
}

export interface IStudy extends Required<CreateStudy> {
  variants: IStudyVariant[];
}
