import HttpError from "../types/errors";
import { CustomizedBattery, Study } from "../models";

import type { HydratedDocument, Types } from "mongoose";
import type {
  CreateCustomizedBattery,
  GETCustomizedTask,
  GETStudies,
  GETStudy,
  IBattery,
  IStudy,
  IStudyVariant,
  IUser,
  PUTStudy,
} from "@seitz/shared";
import type { APIResponse } from "../util/handlers";

export const getMyStudies = async (
  user: HydratedDocument<IUser>
): APIResponse<GETStudies> => {
  return [
    200,
    (await user.populate<{ studies: HydratedDocument<IStudy>[] }>("studies"))
      .studies,
  ];
};

export const deleteStudy = async (
  user: HydratedDocument<IUser>,
  studyId: string
): APIResponse<void> => {
  const studyIndex = user.studies.findIndex((id) => id.toString() === studyId);
  if (studyIndex === -1) throw new HttpError(404);

  const study = await Study.findById(studyId);
  if (!study) throw new HttpError(404);

  study.deleteOne();
  user.studies.splice(studyIndex, 1);
  user.save();
  return [200];
};

export const getStudy = async (
  user: HydratedDocument<IUser>,
  studyId: string
): APIResponse<GETStudy> => {
  const study = await Study.findOne({
    _id: studyId,
    owner: user._id,
  }).populate<{
    batteries: GETCustomizedTask[];
  }>({
    path: "batteries",
    populate: {
      path: "battery",
      model: "Battery",
    },
  });

  if (!study) {
    throw new HttpError(404);
  }

  return [200, study];
};

export const createBlankStudy = async (
  user: HydratedDocument<IUser>
): APIResponse<Types.ObjectId> => {
  const study = await Study.create({ owner: user._id });

  await user.updateOne({ $push: { studies: study._id } });
  return [201, study._id];
};

// Updates existing study, assumes that it exists
export const updateStudy = async (
  user: HydratedDocument<IUser>,
  studyId: string,
  studyData: PUTStudy
): APIResponse<IStudy> => {
  const study = await Study.findOneAndUpdate(
    { _id: studyId, owner: user._id },
    studyData,
    { new: true }
  );
  if (!study) {
    throw new HttpError(404);
  }
  return [200, study];
};

// For updating and copying a task
export const putTask = async (
  user: HydratedDocument<IUser>,
  studyId: string,
  taskId: string,
  taskData: CreateCustomizedBattery
): APIResponse<GETCustomizedTask> => {
  const study = await Study.findOne({ _id: studyId });
  if (!study || study.owner.toString() !== user._id.toString()) {
    throw new HttpError(404);
  }

  const existing = await CustomizedBattery.findById(taskId);
  if (existing) {
    if (!study.batteries.some((id) => id.toString() === taskId)) {
      throw new HttpError(403);
    }
    const task = await CustomizedBattery.findByIdAndUpdate(
      existing._id,
      { ...taskData, _id: existing._id },
      {
        new: true,
      }
    );
    if (!task) throw new HttpError(404); // Shouldn't happen
    const populated = await task.populate<{ battery: IBattery }>("battery");
    return [201, populated];
  } else {
    const task = await CustomizedBattery.create({
      _id: taskId,
      ...taskData,
    });
    await study.updateOne({ $push: { batteries: task._id } });
    const populated = await task.populate<{ battery: IBattery }>("battery");
    return [200, populated];
  }
};

export const getVariant = async (
  serverCode: string
): APIResponse<IStudyVariant> => {
  if (!serverCode) {
    throw new HttpError(400, "Missing serverCode in query parameters");
  }

  const study = await Study.findOne({
    "variants.serverCode": serverCode,
  }).populate({
    path: "variants.sessions.tasks.task",
    populate: { path: "battery" }, // Populate the battery field inside the CustomizedBattery
  });

  if (!study) {
    throw new HttpError(
      404,
      `No study found containing the serverCode ${serverCode}`
    );
  }

  // Find the specific variant with the matching serverCode
  const variant = study.variants.find((v) => v.serverCode === serverCode);

  if (!variant) {
    throw new HttpError(
      404,
      `Variant with the serverCode ${serverCode} not found`
    );
  }

  return [200, variant];
};

export const deleteCustomizedTask = async (
  studyId: string,
  taskId: string
): APIResponse<void> => {
  console.log("deleting task", taskId);

  const task = await CustomizedBattery.findByIdAndDelete(taskId);

  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  const study = await Study.findByIdAndUpdate(studyId, {
    $pull: {
      "variants.$[].sessions.$[].tasks": { task: taskId },
    },
  });

  if (!study) {
    throw new HttpError(404, "Study or session not found");
  }

  return [200];
};
