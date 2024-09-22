import { Router } from "express";
import { Study, IStudy, IUser } from "../models";
import HttpError from "../types/errors";
import isAuthenticated from "../middleware/auth";
import { HydratedDocument } from "mongoose";
import { CustomizedBattery, ICustomizedBattery } from "../models/battery";

const router = Router();

router.get("/", isAuthenticated, (req, res) => {
  const user = req.user as HydratedDocument<IUser>;
  user
    .populate<{ studies: IStudy[] }>("studies")
    .then((user) => res.json(user.studies));
});

router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user as HydratedDocument<IUser>;
    const studyIndex = user.studies.findIndex(
      (id) => id.toString() === req.params["id"]
    );
    if (studyIndex === -1) {
      return next(new HttpError(403));
    }
    const study = await Study.findById(req.params["id"]);
    if (!study) {
      return next(new HttpError(404));
    }
    study.deleteOne();
    user.studies.splice(studyIndex, 1);
    user.save();
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", isAuthenticated, (req, res, next) => {
  try {
    const user = req.user as HydratedDocument<IUser>;

    Study.findById(req.params["id"])
      .populate<{ batteries: ICustomizedBattery[] }>({
        path: "batteries",
        populate: {
          path: "battery",
          model: "Battery",
        },
      })
      .then((study) => {
        if (study?.owner.toString() !== user._id.toString()) {
          return next(new HttpError(404));
        }
        res.json(study);
      })
      .catch(next);
  } catch (e) {
    next(e);
  }
});

router.post("/new", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user as HydratedDocument<IUser>;
    const study = await Study.create({ owner: user._id });

    await user.updateOne({ $push: { studies: study._id } });
    res.status(201).json(study);
  } catch (e) {
    next(e);
  }
});

// Updates existing study, assumes that it exists
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user as HydratedDocument<IUser>;

    const study = await Study.findOneAndUpdate(
      { _id: req.params["id"], owner: user._id },
      req.body,
      { new: true }
    );
    if (!study) {
      next(new HttpError(404));
    }
    res.json(study);
  } catch (e) {
    next(e);
  }
});

// For updating and copying a task
router.put(
  "/:studyId/tasks/:taskId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const study = await Study.findOne({ _id: req.params["studyId"] });
      const user = req.user as HydratedDocument<IUser>;
      if (!study || study.owner.toString() !== user._id.toString()) {
        return next(new HttpError(404));
      }

      const existing = await CustomizedBattery.findById(req.params["taskId"]);
      if (existing) {
        if (
          !study.batteries.some((id) => id.toString() === req.params["taskId"])
        ) {
          return next(new HttpError(403));
        }
        const task = await CustomizedBattery.findByIdAndUpdate(
          existing._id,
          { ...req.body, _id: existing._id },
          {
            new: true,
          }
        );
        res.json(await task?.populate("battery"));
      } else {
        const task = await CustomizedBattery.create({
          ...req.body,
          _id: req.params["taskId"],
        });
        await study.updateOne({ $push: { batteries: task._id } });
        res.json(await task.populate("battery"));
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g: any = e as any;
      console.log("Error", g.stack);
      console.log("Error", g.name);
      console.log("Error", g.message);
      next(e);
    }
  }
);

export default router;
