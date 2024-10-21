import type { IBattery, ICustomizedBattery } from "../models";

type ListTask = Pick<IBattery, "_id" | "name" | "description" | "imageUrl">;

export type GETTask = Pick<
  IBattery,
  "_id" | "name" | "description" | "imageUrl" | "stages"
>;

export type GETTasks = ListTask[];

export type GETCustomizedTask = Pick<
  ICustomizedBattery,
  "_id" | "name" | "values"
> & {
  battery: GETTask;
};

// TODO: refine this type
// export type PUTStudy = DTO<
//   Pick<IStudy, "_id" | "name" | "description" | "owner" | "sessions"> & {
//     batteries: ICustomizedBattery[];
//   }
// >;
