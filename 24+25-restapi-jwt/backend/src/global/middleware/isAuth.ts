import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

//frontend sends token with header to backend where this middleware intercepts before routing...
//verify this token that came in

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  //test if authorization header is present
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    const error = new Error('Not Authenticated');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);

  if (!decodedToken) {
    const error = new Error('not authenticated');
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;

  next();
};
