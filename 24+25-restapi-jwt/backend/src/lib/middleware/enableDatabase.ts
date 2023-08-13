import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { IError } from '../interfaces/IError';

export const enableDatabase = (uri: string, databaseName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //connect to db
    try {
      await mongoose.connect(uri, { dbName: databaseName });
    } catch (err) {
      const error: IError = new Error('Failed to connect to database');
      error.statusCode = 500;
      throw error;
    }

    next();
  };
};
