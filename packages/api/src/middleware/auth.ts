import { Request, Response, NextFunction } from "express";

const isAuthenticated = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({ message: "Unauthenticated user" });
};

export default isAuthenticated;
