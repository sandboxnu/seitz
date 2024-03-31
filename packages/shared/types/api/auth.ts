import type { IUser } from "../models";

export type SignupDTO = Pick<IUser, "email" | "password">;
export type LoginDTO = Pick<IUser, "email" | "password">;

export interface GETUser extends Omit<IUser, "studies"> {
  _id: string;
  studies: string[];
}
