import { Request, Response, NextFunction } from 'express';

import validate from '../../lib/validators'; // import validate from 'validate.js';  //NB: dont import validate directly
import { jsonApiErrorResponseFromValidateJsError } from '../helpers/jsonApiErrorResponseFromValidateJsError';

export const validateRequestData = (validation: object) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validate(req.body.data.attributes, validation, {
        format: 'detailed',
      });
    } catch (errors: any) {
      const formattedResponse = { errors: jsonApiErrorResponseFromValidateJsError(errors) };
      return res.status(422).json(formattedResponse);
    }

    next();
  };
};
