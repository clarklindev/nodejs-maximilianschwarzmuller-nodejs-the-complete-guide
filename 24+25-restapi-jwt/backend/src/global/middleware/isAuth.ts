import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { ErrorWithStatus } from '../interfaces/ErrorWithStatus';
import { IRequest } from '../interfaces/IRequest';

//frontend sends token with header to backend where this middleware intercepts before routing...
//verify this token that came in

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'no token' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'token invalid - Unauthorized.' });
    } else {
      console.log('VERIFIED');
      // Access the userId from the decoded JWT payload
      console.log('decoded: ', decoded);

      const userId = decoded.userId;

      req.userId = userId;

      next();
    }
  });
};
