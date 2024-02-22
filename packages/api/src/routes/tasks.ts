import { Router } from "express";
import {
  Battery,
  CustomizedBattery,
  IBatteryStage,
  IOptionValue,
} from "../models/battery";
import HttpError from "../types/errors";
import isAuthenticated from "../middleware/auth";
import { HydratedDocument } from "mongoose";
import { IStudy, Study, IUser } from "../models";

const router = Router();

router.get("/", isAuthenticated, async (req, res, next) => {
  Battery.find()
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
    const values: IOptionValue[] = [];
    battery.stages.forEach((stage) => {
      stage.options.forEach((option) => {
        values.push({
          option: option._id!,
          value: option.default,
        });
      });
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

export default router;
