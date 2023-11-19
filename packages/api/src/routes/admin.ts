import { Router } from "express";
import isAdmin from "../middleware/admin";

const router = Router();

router.get("/", isAdmin, (req, res) => {
  res.status(200).send("You are an admin");
});

export default router;
