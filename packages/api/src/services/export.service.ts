import { Study } from "../models"; // uses your existing Study model
import type { IStudyVariant } from "@seitz/shared";

// Lightweight local types to avoid `any` and satisfy eslint rules.
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

/**
 * Build condition export
 * Returns an object that looks like: { StudyId, StudyName, Conditions: [{ ProtocolKey, StudyName }, ...] }
 */
export async function buildStudyConditionExport(studyId: string) {
  // load study and ensure ownership (or allow admin)
  // If you already have an ownership check in another service, reuse it.
  const study = await Study.findById(studyId)
    .populate({
      path: "variants.sessions.tasks.task",
      populate: { path: "battery" },
    })
    .lean()
    .exec();

  if (!study) throw new Error("Study not found");

  // mapping -> list of conditions (one per variant)
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

/**
 * build full client export for study
 */
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
      // b may already be populated
      const id =
        (b as unknown as LooseRecord)._id?.toString?.() ?? String(b as unknown);
      if (!batteryMap.has(id)) batteryMap.set(id, b as unknown);
    }
  }

  // scan tasks in variants for referenced batteries
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

  // Build Batteries export as an array
  const Batteries = Array.from(batteryMap.values()).map((b) => {
    // b may be a CustomizedBattery (with .battery populated) or a Battery
    const baseBattery = (b as unknown as LooseRecord).battery ?? b;
    const base = baseBattery as BaseBatteryLike;

    const stages = (base.stages || []).map((s) => {
      const stage = s as StageLike;
      const mapped: Record<string, unknown> = { ...(stage as LooseRecord) };
      // normalize keys
      if (stage.type) {
        mapped.Type = stage.type;
        delete (mapped as LooseRecord).type;
      }
      if (stage.stageLabel) {
        mapped.StageLabel = stage.stageLabel;
        delete (mapped as LooseRecord).stageLabel;
      }
      // TODO: stage precursor doesnt exist right now so placeholder is gonna be none, but should we add?
      if (!mapped["Stage Precursor"]) {
        if ((stage as LooseRecord).stagePrecursor) {
          mapped["Stage Precursor"] = (stage as LooseRecord).stagePrecursor;
        } else {
          mapped["Stage Precursor"] = { Type: "None" };
        }
      }
      return mapped;
    });

    //TODO: our batteries right now also don't have a type field, temp making custom
    return {
      Type: "Custom",
      Name: (b as LooseRecord).name ?? base.name ?? "",
      Description: base.description ?? "",
      Version: (base.version as number) || 0,
      Stages: stages,
    };
  });

  // Conditions: one entry per variant
  const Conditions = ((study.variants || []) as unknown as VariantLike[]).map(
    (v) => ({
      ProtocolKey: v.serverCode || "",
      StudyName: studyName,
    })
  );

  // Protocols: build a ClientProtocolExport-like structure
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

        // If element is a battery element
        const task = (elem as TaskInstanceLike).task as TaskRefLike | undefined;

        // Use the customized battery name (if present) or fallback to referenced battery name
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

    //TODO: keeping protocolkey as variant server id for now
    const protocolKey = variant.serverCode ?? String(variant._id ?? "");
    Protocols[protocolKey] = {
      Name: variant.name || "",
      Sessions: protocolSessions,
    };
  }

  //TODO: where to get version? keeping 1 for now
  const ProtocolExport = {
    Version: 1,
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

// Export study files to disk. This is a small helper used by maintenance scripts
// to write the raw study JSON and the client export.
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

  // write raw study
  await fs.writeFile(
    path.join(studyDir, "study.json"),
    JSON.stringify(study, null, 2),
    "utf-8"
  );

  // build and write client export
  const clientExport = await buildFullClientExport(studyId);
  await fs.writeFile(
    path.join(studyDir, "clientExport.json"),
    JSON.stringify(clientExport, null, 2),
    "utf-8"
  );

  return studyDir;
}
