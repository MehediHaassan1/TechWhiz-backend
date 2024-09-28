import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import config from "../config";
import { TErrorSources } from "../interface/error";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let statusCode = 500;
  let message = 'Something went wrong!'

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!'
    }
  ]

  if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorSources = [
      {
        path: '',
        message: error?.message,
      },
    ];
  } else if (error instanceof Error) {
    message = error.message;
    errorSources = [
      {
        path: '',
        message: error?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorSources,
    // error,
    stack: config.NODE_ENV === 'development' ? error.stack : null
  })
}


export default globalErrorHandler;