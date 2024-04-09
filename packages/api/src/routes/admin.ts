import * as crypto from "crypto";
import { Router } from "express";
import isAdmin from "../middleware/admin";
import { Battery, IBattery, IBatteryStage, IOption } from "../models/battery";
const router = Router();

/* eslint-disable @typescript-eslint/no-explicit-any */
function parseOptions(s: any): IOption[] {
  return Object.entries(s).reduce((acc: IOption[], item: any) => {
    const optionName = item[0];
    const optionValue = item[1];
    // FIXME: Might need stage precursor later
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
          name: s["StageLabel"],
          options,
        },
      };
    });

    const bat: IBattery = {
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
