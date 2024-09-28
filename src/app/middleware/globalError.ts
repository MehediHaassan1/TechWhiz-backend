import { NextFunction, Request, Response } from "express";
import { TErrorSources } from "../interface/error";
import AppError from "../errors/AppError";
import config from "../config";

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
  } else if (error.name === "TokenExpiredError") {
    statusCode = 400;
    message = 'Invalid token!';
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


const errorHandlerWithParams: (params: any) => any = (params) => {
  return (error: any, req: Request, res: Response, next: NextFunction) => {
    globalErrorHandler(error, req, res, next);
  };
};

export default errorHandlerWithParams;

