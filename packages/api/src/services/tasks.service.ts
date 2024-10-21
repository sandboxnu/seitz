import {
  CreateOptionValue,
  GETCustomizedTask,
  GETTasks,
  IBattery,
  IBatteryStage,
  IStudy,
  IUser,
} from "@seitz/shared";
import { Battery, CustomizedBattery, Study } from "../models";
import { APIResponse } from "../util/handlers";
import { HydratedDocument } from "mongoose";
import HttpError from "../types/errors";

export const getTaskLibrary = async (): APIResponse<GETTasks> => {
  return [200, await Battery.find({ deleted: false })];
};

export const getTaskById = async (taskId: string): APIResponse<IBattery> => {
  const task = await Battery.findById(taskId);
  if (!task) throw new HttpError(404);
  return [200, task];
};

export const getCustomizedTask = async (
  user: HydratedDocument<IUser>,
  customId: string
): APIResponse<GETCustomizedTask> => {
  const myStudies = (await user.populate<{ studies: IStudy[] }>("studies"))
    .studies;

  if (
    !myStudies.some((s) => s.batteries.some((b) => b.toString() === customId))
  ) {
    throw new HttpError(404);
  }

  const customizedTask = await CustomizedBattery.findById(customId)
    .lean()
    .populate<{
      battery: IBattery;
    }>("battery");

  if (!customizedTask) throw new HttpError(404);
  return [200, customizedTask];
};

function createAllOptions(
  group: IBatteryStage["options"],
  values: CreateOptionValue[]
) {
  group.options.forEach((option) => {
    if (option.type == "group") {
      createAllOptions(option, values);
    } else {
      values.push({
        option: option._id!,
        value: option.default,
      });
    }
  });
}

export const createCustomizedTask = async (
  user: HydratedDocument<IUser>,
  studyId: string,
  batteryId: string,
  customName: string
): APIResponse<GETCustomizedTask> => {
  if (!user.studies.some((id) => id.toString() === studyId)) {
    throw new HttpError(404);
  }

  const battery = await Battery.findById(batteryId).lean();

  if (!battery) throw new HttpError(404);
  const values: CreateOptionValue[] = [];
  battery.stages.forEach((stage) => {
    createAllOptions(stage.options, values);
  });

  const customBattery = await CustomizedBattery.create({
    battery: battery._id,
    name: customName,
    values,
  });

  await Study.findByIdAndUpdate(
    { _id: studyId },
    {
      $push: { batteries: customBattery._id },
    }
  );
  const populated = await customBattery.populate<{ battery: IBattery }>(
    "battery"
  );
  return [201, populated];
};

export const deleteTask = async (batteryId: string): APIResponse<void> => {
  await Battery.updateOne({ _id: batteryId }, { deleted: true });
  return [200];
};
