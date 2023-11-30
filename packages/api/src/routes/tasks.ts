import { Router } from "express";
import { Battery, IBatteryStage } from "../models/battery";

const router = Router();

router.get("/", async (req, res, next) => {
  Battery.find()
    .then((batteries) => res.json(batteries))
    .catch(next);
});

router.get("/:id", async (req, res, next) => {
  Battery.findById(req.params.id)
    .populate<{ stages: IBatteryStage }>("stages")
    .then((battery) => res.json(battery))
    .catch(next);
});

export default router;
