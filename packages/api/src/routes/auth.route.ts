import { Router } from "express";

import { isAuthenticated } from "../middleware/auth";
import { authRoute, route } from "../util/handlers";
import * as authService from "../services/auth.service";
import passport from "passport";

const router = Router();

router.post("/signup", (req, res, next) => authService.signUp(req, res, next));

router.post(
  "/login",
  passport.authenticate("local", { failWithError: true }),
  authRoute((req) => authService.login(req))
);

router.post(
  "/logout",
  isAuthenticated,
  authRoute((req) => authService.logout(req))
);

router.get(
  "/user",
  isAuthenticated,
  authRoute((req) => authService.getUser(req))
);

router.get(
  "/users",
  isAuthenticated,
  authRoute(() => authService.getUsers())
);

router.get(
  "/verify/:token",
  route((req) => authService.verifyToken(req))
);

export default router;
