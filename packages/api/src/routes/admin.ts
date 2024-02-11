import { Router } from "express";
import isAdmin from "../middleware/admin";
import {
  Battery,
  BatteryStage,
  IBattery,
  IBatteryStage,
  IOption,
} from "../models/battery";
import { HydratedDocument } from "mongoose";
import * as crypto from "crypto";

const router = Router();

router.get("/stages", isAdmin, (req, res, next) => {
  BatteryStage.find()
    .then((stages) => res.json(stages))
    .catch(next);
});

/* eslint-disable @typescript-eslint/no-explicit-any */
router.post("/battery", isAdmin, async (req, res, next) => {
  try {
    const json = req.body as Record<string, any> & {
      Stages: Record<string, any>[];
    };
    const name = json["Name"];
    const desc = json["Description"];
    const imageUrl = `https://picsum.photos/300/300?${crypto.randomUUID()}`;
    const stages: IBatteryStage[] = json["Stages"].map((s: any) => {
      const options: IOption[] = Object.entries(s).reduce(
        (acc: IOption[], item: any) => {
          const optionName = item[0];
          const optionValue = item[1];
          if (
            ["Type", "StageLabel"].includes(optionName) ||
            typeof optionValue === "object"
          )
            return acc;
          const option: IOption = {
            name: optionName,
            default: optionValue,
            type:
              typeof optionValue === "number"
                ? "number"
                : typeof optionValue === "boolean"
                ? "checkbox"
                : "text",
          };
          acc.push(option);
          return acc;
        },
        []
      );

      return {
        stageLabel: s["StageLabel"],
        type: s["Type"],
        options,
      };
    });

    const newStages: HydratedDocument<IBatteryStage>[] = [];

    for (const stage of stages) {
      const existing = await BatteryStage.findOne({ type: stage.type });
      if (!existing) {
        newStages.push(await BatteryStage.create(stage));
      }
    }

    const bat: IBattery = {
      name: name,
      description: desc,
      imageUrl: imageUrl,
      stages: newStages.map((s) => s._id),
      deleted: false,
    };

    const data = await Battery.create(bat);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

router.post("/battery/:id", isAdmin, async (req, res, next) => {
  try {
    const updates = req.body as Record<string, any>;
    const id = req.params.id;
    const battery = await Battery.findById(id);
    if (!battery) {
      res.status(404).send("Battery not found");
      return;
    }
    for (const [key, value] of Object.entries(updates)) {
      // TODO: how to handle updates?
      await Battery.updateOne({ _id: id }, { $set: { [key]: value } });
    }
    res.status(200).json(battery);
  } catch (e) {
    next(e);
  }
});

/* eslint-enable @typescript-eslint/no-explicit-any */
export default router;
