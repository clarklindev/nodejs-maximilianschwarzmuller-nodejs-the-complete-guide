import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IError } from '../interfaces/IError';
//frontend sends token with header to backend where this middleware intercepts before routing...
//verify this token that came in

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  //test if authorization header is present

  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error: IError = new Error('Not Authorized - token error');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];

  const decodedToken: JwtPayload | string = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);

  if (!decodedToken) {
    const error: IError = new Error('invalid token / not authenticated');
    error.statusCode = 401;
    throw error;
  }
  req.userId = (decodedToken as JwtPayload).userId;

  next();
};
