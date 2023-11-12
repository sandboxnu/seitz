import { Request, Response, NextFunction } from "express";
import HttpError from "../types/errors";
import { IUser } from "../models/user";

const isAdmin = function (req: Request, res: Response, next: NextFunction) {
  const user = req.user as IUser;
  if (user?.isAdmin) {
    return next();
  }
  next(new HttpError(403, "Admin access only"));
};

export default isAdmin;
