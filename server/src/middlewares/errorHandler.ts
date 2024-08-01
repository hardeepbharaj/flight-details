import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import { HttpErrorType } from './types/errorTypes';

dotenv.config();

export const errorHandler = (err: HttpErrorType, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message: message,
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
};
