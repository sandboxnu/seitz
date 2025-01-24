import { Types } from "mongoose";

export enum Role {
  BasicUser = "basic-user",
  UserManager = "user-manager",
  StudyManager = "study-manager",
  SuperAdmin = "super-admin",
}

export interface CreateUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  role: Role;
  studies?: Types.ObjectId[];
}

export interface IUser extends Required<CreateUser> {
  token: string;
  verified: boolean;
  verifyPassword(password: string): Promise<boolean>;
}
