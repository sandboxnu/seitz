import { Types } from "mongoose";

export interface CreateUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  isAdmin?: boolean;
  studies?: Types.ObjectId[];
}

export interface IUser extends Required<CreateUser> {
  verifyPassword(password: string): Promise<boolean>;
}
