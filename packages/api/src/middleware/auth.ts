import HttpError from "../types/errors";

import type { RequestHandler } from "express";
import type { IUser } from "@seitz/shared";

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  next(new HttpError(401, "Unauthorized"));
};

export const isAdmin: RequestHandler = (req, res, next) => {
  const user = req.user as IUser;
  if (user?.isAdmin) {
    return next();
  }
  next(new HttpError(403, "Admin access only"));
};
