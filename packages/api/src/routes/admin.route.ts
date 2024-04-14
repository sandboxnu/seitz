import * as crypto from "crypto";
import { Router } from "express";

import { Battery, User } from "../models";
import { isAdmin } from "../middleware/auth";
import HttpError from "../types/errors";
import type {
  CreateBattery,
  CreateBatteryStage,
  CreateOption,
} from "@seitz/shared";

const router = Router();

router.post("/promote", isAdmin, async (req, res, next) => {
  try {
    const filter = { email: req.body.email };
    const update = { isAdmin: true };
    const user = await User.findOneAndUpdate(filter, update);
    if (!user) {
      throw new HttpError(404);
    }
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

/* eslint-disable @typescript-eslint/no-explicit-any */
function parseOptions(s: any): CreateOption[] {
  return Object.entries(s).reduce((acc: CreateOption[], item: any) => {
    const optionName = item[0];
    const optionValue = item[1];
    // FIXME: Might need stage precursor later
    if (["Type", "StageLabel", "Stage Precursor"].includes(optionName))
      return acc;

    let option: CreateOption;

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
    const stages: CreateBatteryStage[] = json["Stages"].map((s: any) => {
      const options: CreateOption[] = parseOptions(s);

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

    const bat: CreateBattery = {
      name: name,
      description: desc,
      imageUrl: imageUrl,
      stages: stages,
      deleted: false,
    };

    const data = await Battery.create(bat);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

router.put("/battery/:id", isAdmin, async (req, res, next) => {
  try {
    const updates = req.body as Record<string, any>;
    const id = req.params.id;
    const battery = await Battery.findById(id);
    if (!battery) {
      res.status(404).send("Battery not found");
      return;
    }
    const newBattery = await Battery.updateOne({ _id: id }, updates, {
      new: true,
    });
    res.status(200).json(newBattery);
  } catch (e) {
    next(e);
  }
});

/* eslint-enable @typescript-eslint/no-explicit-any */
export default router;
