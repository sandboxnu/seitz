import { ErrorRequestHandler } from "express";
import { MongooseError } from "mongoose";

const errorHandler: ErrorRequestHandler = (err, _req, res) => {
  let errStatus = err.statusCode || 500;
  let errMessage = null;
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
