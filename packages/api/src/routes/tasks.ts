import { Router } from "express";
import {
  Battery,
  CustomizedBattery,
  IBatteryStage,
  IOptionValue,
} from "../models/battery";
import HttpError from "../types/errors";
import { Study } from "../models";

const router = Router();

router.get("/", async (req, res, next) => {
  Battery.find()
    .then((batteries) => res.json(batteries))
    .catch(next);
});

router.get("/custom/:id", (req, res, next) => {
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

router.post("/:id/custom", (req, res, next) => {
  const studyId = req.query.studyId;
  req.body.name;
  Battery.findById(req.params.id)
    .populate<{ stages: IBatteryStage[] }>("stages")
    .then((battery) => {
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
      CustomizedBattery.create({
        battery: battery._id,
        name: req.body.name,
        values,
      })
        .then((customBattery) => {
          Study.findByIdAndUpdate(
            { _id: studyId },
            {
              $push: { batteries: customBattery._id },
            }
          ).catch(next);
          res.status(201).json(customBattery);
        })
        .catch(next);
    })
    .catch(next);
});

export default router;
