import { Router } from "express";
import { Battery } from "../models/battery";

const router = Router();

router.get("/", async (req, res, next) => {
  Battery.find()
    .then((batteries) => res.json(batteries))
    .catch(next);
});

export default router;
