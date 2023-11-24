import { Router } from "express";
import Study from "../models/study";
import HttpError from "../types/errors";

const router = Router();

router.get("/", (req, res, next) => {
  Study.find()
    .then((studies) => res.json(studies))
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  Study.findById(req.params["id"])
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
