import { Router } from "express";
import isAdmin from "../middleware/admin";
import HttpError from "../types/errors";

const router = Router();

router.get("/", isAdmin, (req, res, next) => {
    res.status(200).send("You are an admin");
});


export default router;