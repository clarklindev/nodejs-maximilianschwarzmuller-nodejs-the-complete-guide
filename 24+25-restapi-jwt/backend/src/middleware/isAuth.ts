import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ErrorWithStatus } from '../global/interfaces/ErrorWithStatus';
import { IRequest } from '../global/interfaces/IRequest';

//frontend sends token with header to backend where this middleware intercepts before routing...
//verify this token that came in

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error: ErrorWithStatus = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];
  let decodedToken: JwtPayload;
  try {
    decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret
    ) as JwtPayload;
  } catch (err) {
    (err as ErrorWithStatus).statusCode = 500;
    throw err;
  }

  //when there is no decoded token
  if (!decodedToken) {
    const error: ErrorWithStatus = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  //valid token onwards
  (req as IRequest).userId = decodedToken.userId;

  next();
};
