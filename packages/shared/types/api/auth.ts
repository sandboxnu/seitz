import type { IUser } from "../models";

export type SignupDTO = Pick<
  IUser,
  "email" | "password" | "firstName" | "lastName"
>;
export type LoginDTO = Pick<IUser, "email" | "password">;
