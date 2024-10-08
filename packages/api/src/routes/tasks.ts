import { Router } from "express";
import {
  Battery,
  CustomizedBattery,
  IOptionGroup,
  IOptionValue,
} from "../models/battery";
import HttpError from "../types/errors";
import isAdmin from "../middleware/admin";
import isAuthenticated from "../middleware/auth";
import { HydratedDocument } from "mongoose";
import { IStudy, Study, IUser } from "../models";

const router = Router();

router.get("/", isAuthenticated, async (req, res, next) => {
  Battery.find({ deleted: false })
    .then((batteries) => res.json(batteries))
    .catch(next);
});

router.get("/:id", async (req, res, next) => {
  Battery.findById(req.params.id)
    .then((b) => res.json(b))
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
    .populate("battery")
    .then((customBattery) => res.json(customBattery))
    .catch(next);
});

function createAllOptions(group: IOptionGroup, values: IOptionValue[]) {
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

    const battery = await Battery.findById(req.params.id);

    if (!battery) return next(new HttpError(404));
    const values: IOptionValue[] = [];
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

    res.status(201).json(await customBattery.populate("battery"));
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
