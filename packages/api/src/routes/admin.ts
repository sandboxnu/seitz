import * as crypto from "crypto";
import { Router } from "express";
import { Types } from "mongoose";
import isAdmin from "../middleware/admin";
import {
  Battery,
  BatteryStage,
  IBattery,
  IBatteryStage,
  IOption,
} from "../models/battery";
const router = Router();

router.get("/stages", isAdmin, (req, res, next) => {
  BatteryStage.find()
    .then((stages) => res.json(stages))
    .catch(next);
});

/* eslint-disable @typescript-eslint/no-explicit-any */
function parseOptions(s: any): IOption[] {
  return Object.entries(s).reduce((acc: IOption[], item: any) => {
    const optionName = item[0];
    const optionValue = item[1];
    // FIXME: Might need stage precursor later ;)
    if (["Type", "StageLabel", "Stage Precursor"].includes(optionName))
      return acc;

    let option: IOption;

    if (typeof optionValue === "object") {
      const groupOptions = parseOptions(optionValue);

      option = {
        type: "group",
        name: optionName,
        options: groupOptions,
      };
    } else {
      option = {
        name: optionName,
        default: optionValue,
        type:
          typeof optionValue === "number"
            ? "number"
            : typeof optionValue === "boolean"
            ? "checkbox"
            : "text",
      };
    }

    acc.push(option);
    return acc;
  }, []);
}

router.post("/battery", isAdmin, async (req, res, next) => {
  try {
    const json = req.body as Record<string, any> & {
      Stages: Record<string, any>[];
    };
    const name = json["Name"];
    const desc = json["Description"];
    const imageUrl = `https://picsum.photos/300/300?${crypto.randomUUID()}`;
    const stages: IBatteryStage[] = json["Stages"].map((s: any) => {
      const options: IOption[] = parseOptions(s);

      return {
        stageLabel: s["StageLabel"],
        type: s["Type"],
        options: {
          type: "group",
          name: s["StageLabel"] ?? s["Type"],
          options,
        },
      };
    });

    const stageIds: Types.ObjectId[] = [];

    for (const stage of stages) {
      const existing = await BatteryStage.findOne({ type: stage.type });
      if (!existing) {
        const newStage = await BatteryStage.create(stage);
        stageIds.push(newStage._id);
      } else {
        stageIds.push(existing._id);
      }
    }

    const bat: IBattery = {
      name: name,
      description: desc,
      imageUrl: imageUrl,
      stages: stageIds,
      deleted: false,
    };

    const data = await Battery.create(bat);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});
/* eslint-enable @typescript-eslint/no-explicit-any */

export default router;
