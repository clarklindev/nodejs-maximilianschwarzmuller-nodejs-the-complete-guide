import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { IRequest } from '../global/interfaces/IRequest';

//frontend sends token with header to backend where this middleware intercepts before routing...
//verify this token that came in

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  // Retrieve the token from the cookie (this is the res.cookie() method, is secure)

  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized.');
    } else {
      // Access the userId from the decoded JWT payload
      const userId = decoded.userId;

      (req as IRequest).userId = userId;

      next();
    }
  });
};
