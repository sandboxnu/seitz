import type { IUser } from "../models";

export type SignupDTO = Pick<IUser, "email" | "password" | "name" | "lastName">;
export type LoginDTO = Pick<IUser, "email" | "password">;
