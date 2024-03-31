import { Router } from "express";

import { Battery, CustomizedBattery, Study } from "../models";
import HttpError from "../types/errors";
import { isAdmin, isAuthenticated } from "../middleware/auth";

import type { HydratedDocument } from "mongoose";
import type {
  CreateOptionValue,
  IBatteryStage,
  IStudy,
  IUser,
} from "@seitz/shared";

const router = Router();

router.get("/", isAuthenticated, async (req, res, next) => {
  Battery.find({ deleted: false })
    .then((batteries) => res.json(batteries))
    .catch(next);
});

router.get("/custom/:id", isAuthenticated, async (req, res, next) => {
  const user = req.user as HydratedDocument<IUser>;
  const myStudies = (await user.populate<{ studies: IStudy[] }>("studies"))
    .studies;

  if (
    !myStudies.some((s) =>
      s.batteries.some((b) => b.toString() === req.params["id"])
    )
  ) {
    return next(new HttpError(404));
  }

  CustomizedBattery.findById(req.params.id)
    .populate({
      path: "battery",
      populate: {
        path: "stages",
        model: "BatteryStage",
      },
    })
    .then((customBattery) => res.json(customBattery))
    .catch(next);
});

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

router.post("/:id/custom", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user as HydratedDocument<IUser>;
    const studyId = req.query.studyId;

    if (!user.studies.some((id) => id.toString() === studyId)) {
      return next(new HttpError(404));
    }

    const battery = await Battery.findById(req.params.id).populate<{
      stages: IBatteryStage[];
    }>("stages");

    if (!battery) return next(new HttpError(404));
    const values: CreateOptionValue[] = [];
    battery.stages.forEach((stage) => {
      createAllOptions(stage.options, values);
    });

    const customBattery = await CustomizedBattery.create({
      battery: battery._id,
      name: req.body.name,
      values,
    });

    await Study.findByIdAndUpdate(
      { _id: studyId },
      {
        $push: { batteries: customBattery._id },
      }
    );

    res.status(201).json(customBattery);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", isAdmin, (req, res, next) => {
  Battery.updateOne({ _id: req.params["id"] }, { deleted: true })
    .then(() => res.sendStatus(200))
    .catch(next);
});

export default router;
