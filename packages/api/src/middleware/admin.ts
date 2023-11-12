import { Request, Response, NextFunction } from "express";
import HttpError from "../types/errors";

const isAdmin = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
    const user = req.user as { isAdmin: boolean };
  if (user && user.isAdmin) {
    return next();
  }
  next(new HttpError(403, "Admin access only"));
};

export default isAdmin;
