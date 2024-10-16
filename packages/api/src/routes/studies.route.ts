import { Router } from "express";

import { isAuthenticated } from "../middleware/auth";
import * as studyService from "../services/study.service";
import { authRoute } from "../util/handlers";

const router = Router();

router.get(
  "/",
  isAuthenticated,
  authRoute((_, user) => studyService.getMyStudies(user))
);

router.delete(
  "/:id",
  isAuthenticated,
  authRoute((req, user) => studyService.deleteStudy(user, req.params.id))
);

router.get(
  "/:id",
  isAuthenticated,
  authRoute((req, user) => studyService.getStudy(user, req.params.id))
);

router.post(
  "/new",
  isAuthenticated,
  authRoute((_, user) => studyService.createBlankStudy(user))
);

// TODO: validate body
router.put(
  "/:id",
  isAuthenticated,
  authRoute((req, user) =>
    studyService.updateStudy(user, req.params.id, req.body)
  )
);

router.put(
  "/:studyId/tasks/:taskId",
  isAuthenticated,
  authRoute((req, user) =>
    studyService.putTask(user, req.params.studyId, req.params.taskId, req.body)
  )
);

export default router;
