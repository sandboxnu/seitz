import { Types } from "mongoose";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type StringIds<T> = T extends Types.ObjectId
  ? string
  : T extends Record<string | number | symbol, any>
  ? {
      [K in keyof T]: StringIds<T[K]>;
    }
  : T;

// export type RequireIds<T> = [T] extends [Types.ObjectId | undefined]
//   ? NonNullable<Types.ObjectId>
//   : T extends Record<string | number | symbol, any>
//   ? {
//       [K in keyof T]: RequireIds<T[K]>;
//     }
//   : number;
/* eslint-enable @typescript-eslint/no-explicit-any */

export type WithId<T> = Omit<T, "_id"> & { _id: Types.ObjectId };

// Converts the output type of a route to the GET DTO type used by the frontend
export type DTO<T> = StringIds<T>;
