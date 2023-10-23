import { Router } from "express";
import Study from "../models/study";
import HttpError from "../types/errors";

const router = Router();

router.get("/", (req, res, next) => {
  Study.find().then(res.json).catch(next);
});

router.get("/:id", (req, res, next) => {
  Study.findById(req.params["id"])
    .then((study) => {
      if (!study) throw new HttpError(404);
      res.json(study);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  Study.create(req.body).then(res.status(201).json).catch(next);
});

export default router;
