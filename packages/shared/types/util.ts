import { Types } from "mongoose";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type StringIds<T> = T extends Types.ObjectId
  ? string
  : T extends Record<string | number | symbol, any>
  ? {
      [K in keyof T]: StringIds<T[K]>;
    }
  : T;

// Converts the output type of a route to the GET DTO type used by the frontend
export type DTO<T> = StringIds<T>;
