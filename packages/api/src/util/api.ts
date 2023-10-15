import { Response } from "express";

function success<T>(res: Response, data: T, statusCode = 200) {
  res.status(statusCode).json(data);
}

function successStatus(res: Response, statusCode = 200) {
  success(res, null, statusCode);
}

export { success, successStatus };
