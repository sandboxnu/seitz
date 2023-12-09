import { Router } from "express";
import { Study, IStudy, IUser } from "../models";
import HttpError from "../types/errors";
import isAuthenticated from "../middleware/auth";
import { HydratedDocument } from "mongoose";
import { ICustomizedBattery } from "@/models/battery";

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
  Study.findById(req.params["id"])
    .populate<{ batteries: ICustomizedBattery[] }>("batteries")
    .then((study) => {
      if (!study) return next(new HttpError(404));
      res.json(study);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  Study.create(req.body)
    .then((study) => res.status(201).json(study))
    .catch(next);
});

router.put("/:id", (req, res, next) => {
  Study.updateOne({ _id: req.params["id"] }, req.body)
    .then((study) => {
      if (!study) throw new HttpError(404);
      res.json(study);
    })
    .catch(next);
});

export default router;
