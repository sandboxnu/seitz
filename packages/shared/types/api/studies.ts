import { DTO } from "../util";

import type { ICustomizedBattery, IStudy } from "../models";

type ListStudy = Pick<IStudy, "_id" | "name" | "description">;

export type GETStudy = Pick<
  IStudy,
  "_id" | "name" | "description" | "owner" | "serverCode" | "variants"
> & {
  batteries: ICustomizedBattery[];
};

export type GETStudies = ListStudy[];

// TODO: refine this type
export type PUTStudy = DTO<
  Pick<
    IStudy,
    "_id" | "name" | "description" | "owner" | "serverCode" | "variants"
  > & {
    batteries: ICustomizedBattery[];
  }
>;
