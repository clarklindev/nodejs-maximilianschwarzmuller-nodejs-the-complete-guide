//deleteAllContacts
import mongoose, { Query } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import Contact from '../../../lib/models/contact';
import { IError } from '../../../lib/interfaces/IError';
import { IContact } from '../../../lib/interfaces/IContact';

const deleteAllContactsForClient = async (
  clientId: string,
): Promise<Query<mongoose.mongo.DeleteResult, IContact> | null> => {
  return await Contact.deleteMany({
    clientId: clientId,
  });
};

//------------------------------------------------------------------------------------------------

export const deleteAllContacts = async (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.query.clientId as string;

  //1. delete
  let result: mongoose.mongo.DeleteResult | null;
  try {
    result = await deleteAllContactsForClient(clientId);
  } catch (err: any) {
    const error: IError = new Error('delete failed');
    error.statusCode = 404;
    return next(error);
  }

  let formattedResponse = {};
  if (result) {
    formattedResponse = {
      data: {
        id: clientId,
        type: 'contact',
        attributes: {},
      },
      meta: {
        ...result,
        message: 'Successfully deleted',
      },
    };
  }

  //2. send response
  return res.status(200).json(formattedResponse);
};
