import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export interface AppError extends Error {
  statusCode: number;
  code: string;
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';

  if ('statusCode' in err) {
    statusCode = err.statusCode;
    code = err.code || 'ERROR';
    message = err.message;
  }

  // Do not expose stack traces or internal errors in production
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(err);
    message = err.message; // Expose full error in dev
  }

  res.status(statusCode).json(errorResponse(code, message));
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json(errorResponse('NOT_FOUND', 'Resource not found'));
};
