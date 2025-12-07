import { Router, Request, Response, NextFunction } from "express";
import type { HydratedDocument } from "mongoose";
import type { IUser } from "@seitz/shared";

import { isAuthenticated } from "../middleware/auth";
import * as studyService from "../services/study.service";
import { authRoute, route } from "../util/handlers";

const router = Router();

router.get(
  "/",
  isAuthenticated,
  authRoute((_, user) => studyService.getMyStudies(user))
);

router.get(
  "/recent",
  isAuthenticated,
  authRoute((_, user) => studyService.getRecentlyEditedStudies(user))
);

router.delete(
  "/:id",
  isAuthenticated,
  authRoute((req, user) => studyService.deleteStudy(user, req.params.id))
);

router.get(
  "/:id/preview",
  isAuthenticated,
  authRoute((req, user) => studyService.getStudyPreview(user, req.params.id))
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

router.delete(
  "/:studyId/tasks/:taskId",
  isAuthenticated,
  authRoute((req) =>
    studyService.deleteCustomizedTask(req.params.studyId, req.params.taskId)
  )
);

router.get(
  "/variants/:serverCode",
  route((req) => studyService.getVariant(req.params.serverCode))
);

// create new variant in study
router.post(
  "/:studyId/variants/new",
  isAuthenticated,
  authRoute((req, user) =>
    studyService.createNewVariant(user, req.params.studyId)
  )
);

// delete variant from study
router.delete(
  "/:studyId/variants/:variantId",
  isAuthenticated,
  authRoute((req, user) =>
    studyService.deleteVariant(user, req.params.studyId, req.params.variantId)
  )
);

router.post(
  "/:studyId/validate-prefix-server-code",
  isAuthenticated,
  authRoute((req) =>
    studyService.validateAndUpdatePrefixServerCode(
      req.params.studyId,
      req.body.prefixServerCode
    )
  )
);

router.post(
  "/:id/duplicate",
  isAuthenticated,
  authRoute((req, user) => studyService.duplicateStudy(user, req.params.id))
);

router.get(
  "/:id/export",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as unknown as HydratedDocument<IUser>;
      const [status, exportObj] = await studyService.exportStudy(
        user,
        req.params.id
      );
      if (!exportObj) return res.sendStatus(status);

      const filename = `study-${req.params.name}-export.json`;
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.status(status).send(JSON.stringify(exportObj, null, 2));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
