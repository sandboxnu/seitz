import { DTO, WithId } from "../util";

import type { ICustomizedBattery, IStudy, IStudyVariant } from "../models";

type ListStudy = WithId<Pick<IStudy, "name" | "description">>;

export type GETStudy = Pick<
  IStudy,
  "_id" | "name" | "description" | "owner" | "serverCode"
> & {
  variants: WithId<IStudyVariant>[];
  batteries: WithId<ICustomizedBattery>[];
};

export type GETStudies = ListStudy[];

// TODO: refine this type
export type PUTStudy = DTO<
  Pick<IStudy, "_id" | "name" | "description" | "owner" | "serverCode"> & {
    variants: WithId<IStudyVariant>[];
    batteries: WithId<ICustomizedBattery>[];
  }
>;
