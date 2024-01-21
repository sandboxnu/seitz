import { Router } from "express";
import {
  Battery,
  CustomizedBattery,
  IBatteryStage,
  IOptionValue,
} from "../models/battery";
import HttpError from "../types/errors";

const router = Router();

router.get("/", async (req, res, next) => {
  Battery.find({ deleted: false })
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

router.put("/custom/:id", async (req, res, next) => {
  CustomizedBattery.findOneAndUpdate({ _id: req.params["id"] }, req.body, {
    upsert: true,
    new: true,
  })
    .then((task) => res.json(task))
    .catch(next);
});

router.post("/:id/custom", (req, res, next) => {
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
        .then((customBattery) => res.status(201).json(customBattery))
        .catch(next);
    })
    .catch(next);
});

router.delete("/:id", (req, res, next) => {
  Battery.updateOne({ _id: req.params["id"] }, { deleted: true })
    .then(() => res.sendStatus(200))
    .catch(next);
});

export default router;
