import { Study } from "../models";
import type { IStudyVariant } from "@seitz/shared";

// Local types used to maintain type safety and accomadate flexibility
type LooseRecord = Record<string, unknown>;
type StageLike = {
  type?: string;
  stageLabel?: string;
  stagePrecursor?: unknown;
} & LooseRecord;
type BaseBatteryLike = {
  stages?: StageLike[];
  name?: string;
  description?: string;
  version?: number;
} & LooseRecord;
type TaskRefLike = {
  _id?: unknown;
  name?: string;
  battery?: { name?: string } & LooseRecord;
} & LooseRecord;
type TaskInstanceLike = { task?: TaskRefLike } & LooseRecord;
type SessionLike = { tasks?: TaskInstanceLike[] } & LooseRecord;
type VariantLike = {
  serverCode?: string;
  _id?: unknown;
  name?: string;
  sessions?: SessionLike[];
} & LooseRecord;

export async function buildStudyConditionExport(studyId: string) {
  const study = await Study.findById(studyId)
    .populate({
      path: "variants.sessions.tasks.task",
      populate: { path: "battery" },
    })
    .lean()
    .exec();

  if (!study) throw new Error("Study not found");

  const conditions = (study.variants || []).map((v: IStudyVariant) => ({
    ProtocolKey: v.serverCode || "",
    StudyName: study.name || "",
  }));

  return {
    StudyId: study._id,
    StudyName: study.name,
    Conditions: conditions,
  };
}

export async function buildFullClientExport(studyId: string) {
  const study = await Study.findById(studyId)
    .populate({ path: "batteries", populate: { path: "battery" } })
    .populate({
      path: "variants.sessions.tasks.task",
      populate: { path: "battery" },
    })
    .lean()
    .exec();

  if (!study) throw new Error("Study not found");

  const studyName = study.name || "";

  const batteryMap = new Map<string, unknown>();

  if (Array.isArray(study.batteries)) {
    for (const b of study.batteries) {
      const id =
        (b as unknown as LooseRecord)._id?.toString?.() ?? String(b as unknown);
      if (!batteryMap.has(id)) batteryMap.set(id, b as unknown);
    }
  }

  if (Array.isArray(study.variants)) {
    for (const variant of (study.variants || []) as unknown as VariantLike[]) {
      for (const session of variant.sessions || []) {
        for (const t of session.tasks || []) {
          const task = (t as TaskInstanceLike).task as TaskRefLike | undefined;
          const idKey = task?._id ? String(task._id) : String(task ?? "");
          if (task && !batteryMap.has(idKey)) {
            batteryMap.set(idKey, task as unknown);
          }
        }
      }
    }
  }

  const Batteries = Array.from(batteryMap.values()).map((b) => {
    const baseBattery = (b as unknown as LooseRecord).battery ?? b;
    const base = baseBattery as BaseBatteryLike;

    const stages = (base.stages || []).map((s) => {
      const stage = s as StageLike;
      const mapped: Record<string, unknown> = { ...(stage as LooseRecord) };
      if (stage.type) {
        mapped.Type = stage.type;
        delete (mapped as LooseRecord).type;
      }
      if (stage.stageLabel) {
        mapped.StageLabel = stage.stageLabel;
        delete (mapped as LooseRecord).stageLabel;
      }
      // Placeholder for stage precursor
      if (!mapped["Stage Precursor"]) {
        if ((stage as LooseRecord).stagePrecursor) {
          mapped["Stage Precursor"] = (stage as LooseRecord).stagePrecursor;
        } else {
          mapped["Stage Precursor"] = { Type: "None" };
        }
      }
      return mapped;
    });

    // Placeholder for type field
    return {
      Type: "Custom",
      Name: (b as LooseRecord).name ?? base.name ?? "",
      Description: base.description ?? "",
      Version: (base.version as number) || 0,
      Stages: stages,
    };
  });

  const Conditions = ((study.variants || []) as unknown as VariantLike[]).map(
    (v) => ({
      ProtocolKey: v.serverCode || "",
      StudyName: studyName,
    })
  );

  const Sessions: unknown[] = [];
  const SessionElements: unknown[] = [];
  const Protocols: Record<string, unknown> = {};

  let nextSessionId = 1;
  let nextElementId = 1;

  for (const variant of (study.variants || []) as unknown as VariantLike[]) {
    const protocolSessions: number[] = [];

    for (const session of variant.sessions || []) {
      const sessionId = nextSessionId++;
      const elementIds: number[] = [];

      for (const elem of session.tasks || []) {
        const elId = nextElementId++;
        elementIds.push(elId);

        const task = (elem as TaskInstanceLike).task as TaskRefLike | undefined;

        const batteryName =
          task?.name ?? task?.battery?.name ?? String(task?._id ?? task);

        SessionElements.push({
          Id: elId,
          Type: "Battery",
          Battery: batteryName,
        });
      }

      Sessions.push({ Id: sessionId, Elements: elementIds });
      protocolSessions.push(sessionId);
    }

    // keeping protocolkey as variant server id
    const protocolKey = variant.serverCode ?? String(variant._id ?? "");
    Protocols[protocolKey] = {
      Name: variant.name || "",
      Sessions: protocolSessions,
    };
  }

  const ProtocolExport = {
    Version: 1, // placeholder since we do not have versioning
    Protocols,
    Sessions,
    SessionElements,
  };

  return {
    studyName,
    Batteries,
    Conditions,
    Protocols: ProtocolExport,
  };
}

import fs from "fs/promises";
import path from "path";

export async function exportStudyToDisk(studyId: string, outDir: string) {
  const study = await Study.findById(studyId).lean().exec();
  if (!study) throw new Error("Study not found");

  await fs.mkdir(outDir, { recursive: true });

  const studyDirName = `${(study.name || "study").replace(
    /[^a-z0-9-_.]/gi,
    "_"
  )}_${studyId}`.slice(0, 140);
  const studyDir = path.join(outDir, studyDirName);
  await fs.mkdir(studyDir, { recursive: true });

  await fs.writeFile(
    path.join(studyDir, "study.json"),
    JSON.stringify(study, null, 2),
    "utf-8"
  );

  const clientExport = await buildFullClientExport(studyId);
  await fs.writeFile(
    path.join(studyDir, "clientExport.json"),
    JSON.stringify(clientExport, null, 2),
    "utf-8"
  );

  return studyDir;
}
