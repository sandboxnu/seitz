import { Router } from "express";
import Car from "../models/example";
import HttpError from "../types/errors";

import { success } from "../util/api";

const router = Router();

router.get("/", (req, res, next) => {
  Car.find()
    .then((cars) => {
      success(res, cars);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  Car.findById(req.params["id"])
    .then((car) => {
      if (!car) throw new HttpError(404);
      success(res, car);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  Car.create(req.body)
    .then((data) => {
      success(res, data);
    })
    .catch(next);
});

export default router;
