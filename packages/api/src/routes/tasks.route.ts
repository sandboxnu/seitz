import { Router } from "express";

import { isAuthenticated } from "../middleware/auth";
import { authRoute, route } from "../util/handlers";
import * as tasksService from "../services/tasks.service";

const router = Router();

router.get(
  "/",
  isAuthenticated,
  route(() => tasksService.getTaskLibrary())
);

router.get(
  "/:id",
  route((req) => tasksService.getTaskById(req.params.id))
);

router.get(
  "/custom/:id",
  isAuthenticated,
  authRoute((req, user) => tasksService.getCustomizedTask(user, req.params.id))
);

router.post(
  "/:id/custom",
  isAuthenticated,
  authRoute((req, user) =>
    tasksService.createCustomizedTask(
      user,
      req.query.studyId as string,
      req.params.id,
      req.body.name
    )
  )
);

router.post(
  "/:id/publish",
  isAuthenticated,
  authRoute((req) => tasksService.publishTask(req.params.id))
);

export default router;
