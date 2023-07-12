import { NextFunction, Request, Response } from 'express';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.get('Authorization')!.split(' ')[1];
  let decodedToken;

  next();
};
