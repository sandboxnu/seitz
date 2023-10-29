import { Router } from "express";
import Car from "../models/example";
import HttpError from "../types/errors";

const router = Router();

router.get("/", async (req, res, next) => {
  Car.find()
    .then((cars) => {
      res.json(cars);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  Car.findById(req.params["id"])
    .then((car) => {
      if (!car) throw new HttpError(404);
      res.json(car);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  Car.create(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(next);
});

export default router;
