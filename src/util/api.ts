import { Response } from "express";

const success = (res: Response, data: any, statusCode: number = 200) => {
  res.status(statusCode).json(data);
};
const successStatus = (res: Response, statusCode: number = 200) => {
  success(res, null, statusCode);
};

export { success, successStatus };
