import { Router } from "express";
import Study from "../models/study";
import HttpError from "../types/errors";

import { success, successStatus } from "../util/api";

const router = Router();

router.get("/", (req, res, next) => {
  Study.find()
    .then(studies => {
      success(res, studies);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  Study.findById(req.params["id"])
    .then(study => {
      if (!study) throw new HttpError(404);
      success(res, study);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  Study.create(req.body)
    .then(data => {
      success(res, data);
    })
    .catch(next);
});

export default router;
