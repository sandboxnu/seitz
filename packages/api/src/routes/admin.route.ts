import { Router } from "express";

import * as adminService from "../services/admin.service";
import { isAdmin } from "../middleware/auth";
import { route } from "../util/handlers";

const router = Router();

router.post(
  "/promote",
  isAdmin,
  route((req) => adminService.promoteToAdmin(req.body.email))
);

router.post(
  "/battery",
  isAdmin,
  route((req) => adminService.createBattery(req.body))
);

router.put(
  "/battery/:id",
  isAdmin,
  route((req) => adminService.editBattery(req.body, req.params.id))
);

export default router;
