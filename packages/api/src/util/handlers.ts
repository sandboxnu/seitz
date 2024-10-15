import type { Request, RequestHandler } from "express";
import type { HydratedDocument } from "mongoose";
import type { IUser } from "@seitz/shared";

export type APIResponse<T> = Promise<[number, T] | [number]>;
export type Handler<T> = (req: Request) => APIResponse<T>;
export type AuthHandler<T> = (
  req: Request,
  user: HydratedDocument<IUser>
) => Promise<[number, T] | [number]>;

export function route<T>(handler: Handler<T>): RequestHandler {
  return async (req, res, next) => {
    try {
      const [status, data] = await handler(req);
      if (data) res.status(status).json(data);
      else res.sendStatus(status);
    } catch (e) {
      next(e);
    }
  };
}

export function authRoute<T>(handler: AuthHandler<T>): RequestHandler {
  return route(async (req) => {
    const user = req.user as HydratedDocument<IUser>;
    return handler(req, user);
  });
}
