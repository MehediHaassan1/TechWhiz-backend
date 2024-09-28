import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).send({
    success: false,
    message: 'Route not found!'
  });
};

const notFoundHandlerWithParams: (params: any) => any = (params) => {
  return (req: Request, res: Response, next: NextFunction) => {
    notFound(req, res, next);
  };
};

export default notFoundHandlerWithParams;