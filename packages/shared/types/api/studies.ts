import { DTO, WithId } from "../util";

import type { ICustomizedBattery, ISession, IStudy } from "../models";

type ListStudy = WithId<Pick<IStudy, "name" | "description">>;

export type GETStudy = WithId<
  Pick<IStudy, "name" | "description" | "owner"> & {
    sessions: WithId<ISession>[];
    batteries: WithId<ICustomizedBattery>[];
  }
>;

export type GETStudies = ListStudy[];

// TODO: refine this type
export type PUTStudy = DTO<
  WithId<
    Pick<IStudy, "name" | "description" | "owner"> & {
      sessions: WithId<ISession>[];
      batteries: WithId<ICustomizedBattery>[];
    }
  >
>;
