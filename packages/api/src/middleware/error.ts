import { ErrorRequestHandler } from "express";
import { MongooseError } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let errStatus = err.statusCode || 500;
  let errMessage = err.message;
  if (err instanceof MongooseError) {
    switch (err.name) {
      case "ValidationError":
        errStatus = 400;
        errMessage = err.message;
        break;
      case "CastError":
        errStatus = 400;
        break;
      default:
    }
  }
  res.status(errStatus).json({
    message: errMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

export default errorHandler;
