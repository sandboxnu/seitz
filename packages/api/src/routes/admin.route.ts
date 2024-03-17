import { Router } from "express";
import { Types } from "mongoose";
import * as crypto from "crypto";

import { Battery, BatteryStage } from "../models";
import { isAdmin } from "../middleware/auth";
import type {
  CreateBattery,
  CreateBatteryStage,
  CreateOption,
} from "@seitz/shared";

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
    const stages: CreateBatteryStage[] = json["Stages"].map((s) => {
      const options = Object.entries(s).reduce(
        (acc: CreateOption[], item: [string, any]) => {
          const optionName = item[0];
          const optionValue = item[1];
          if (
            ["Type", "StageLabel"].includes(optionName) ||
            typeof optionValue === "object"
          )
            return acc;
          const option: CreateOption = {
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

    const stageIds: Types.ObjectId[] = [];

    for (const stage of stages) {
      const existing = await BatteryStage.findOne({ type: stage.type });
      if (existing) {
        stageIds.push(existing._id);
      } else {
        const newStage = await BatteryStage.create(stage);
        stageIds.push(newStage._id);
      }
    }

    const bat: CreateBattery = {
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
