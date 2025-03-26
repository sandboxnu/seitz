import type { DTO } from "../util";

import type { IStudy } from "../models";
import type { GETCustomizedTask } from "./tasks";

type ListStudy = Pick<IStudy, "_id" | "name" | "description">;

export type GETStudy = Pick<
  IStudy,
  "_id" | "name" | "description" | "owner" | "variants" | "prefixServerCode"
> & {
  batteries: GETCustomizedTask[];
};

export type GETStudies = ListStudy[];

// TODO: refine this type
export type PUTStudy = DTO<
  Pick<
    IStudy,
    "_id" | "name" | "description" | "owner" | "variants" | "prefixServerCode"
  > & {
    batteries: GETCustomizedTask[];
  }
>;
