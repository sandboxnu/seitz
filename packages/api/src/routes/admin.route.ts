import { Router } from "express";

import * as adminService from "../services/admin.service";
import { isAdmin } from "../middleware/auth";
import { route } from "../util/handlers";

const router = Router();

router.post(
  "/users/:id",
  isAdmin,
  route((req) => adminService.promoteToAdmin(req.params.id))
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

router.delete(
  "/battery/:id",
  isAdmin,
  route((req) => adminService.deleteBattery(req.params.id))
);

router.get(
  "/users",
  isAdmin,
  route(() => adminService.getAdminUsers())
);

router.delete(
  "/users/:id",
  isAdmin,
  route((req) => adminService.removeUserAsAdmin(req.params.id))
);

router.put(
<<<<<<< HEAD
  "/battery/:id/stage/:stageId/visibility/:status",
  isAdmin,
  route((req) =>
    adminService.updateStageVisibility(
      req.params.id,
      req.params.stageId,
      req.params.status
    )
  )
);

router.put(
=======
>>>>>>> 94315a1 (first implementation)
  "/battery/:id/visibility/:status",
  isAdmin,
  route((req) =>
    adminService.updateAdminVisibility(req.params.id, req.params.status)
  )
);

export default router;
