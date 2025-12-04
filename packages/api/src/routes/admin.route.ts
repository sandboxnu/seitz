import { Router } from "express";

import * as adminService from "../services/admin.service";
import {
  isStudyManager,
  isSuperAdmin,
  isUserManager,
  roleUpdateIsValid,
} from "../middleware/auth";
import { route } from "../util/handlers";

const router = Router();

router.post(
  "/users/:id",
  roleUpdateIsValid,
  route((req) => adminService.updateRole(req.params.id, req.body.role))
);

router.post(
  "/battery",
  isStudyManager,
  route((req) => adminService.createBattery(req.body))
);

router.put(
  "/battery/:id",
  isStudyManager,
  route((req) =>
    adminService.editBattery(req.body, req.params.id, req.body.userId)
  )
);

router.delete(
  "/battery/:id",
  isStudyManager,
  route((req) => adminService.deleteBattery(req.params.id, req.body.userId))
);

router.get(
  "/users",
  isUserManager,
  route(() => adminService.getAdminUsers())
);

router.delete(
  "/users/:id/delete",
  isSuperAdmin,
  route((req) => adminService.deleteUser(req.params.id))
);

router.delete(
  "/users/:id",
  isSuperAdmin,
  route((req) => adminService.removeUserAsAdmin(req.params.id))
);

router.put(
  "/battery/:id/stage/:stageId/visibility/:status",
  isStudyManager,
  route((req) =>
    adminService.updateStageVisibility(
      req.params.id,
      req.params.stageId,
      req.params.status
    )
  )
);

router.put(
  "/battery/:id/visibility/:status",
  isStudyManager,
  route((req) =>
    adminService.updateAdminVisibility(req.params.id, req.params.status)
  )
);

router.post(
  "/users/:id/favorite/:battery_id",
  route((req) =>
    adminService.toggleFavoriteBattery(req.params.id, req.params.battery_id)
  )
);

router.get(
  "/users/:id/recent",
  route((req) => adminService.recentBatteries(req.params.id))
);

export default router;
