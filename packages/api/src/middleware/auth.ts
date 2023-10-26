import { Request, Response, NextFunction } from "express";
import HttpError from "../types/errors";

const isAuthenticated = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }
  next(new HttpError(401, "Unauthorized"));
};

export default isAuthenticated;
