//updateContact
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import Contact from '../../../lib/models/contact';
import { IError } from '../../../lib/interfaces/IError';
import { IContact } from '../../../lib/interfaces/IContact';
import DateHelper from '../../../lib/helpers/DateHelper';
import { jsonApiSuccessResponseFromMongooseQuery } from '../../../lib/helpers/jsonApiSuccessResponseFromMongooseQuery';

const updateContactById = async (
  clientId: string,
  contactId: string,
  updateAttributes: Record<string, any>,
): Promise<IContact | null> => {
  const updatedDocument = await Contact.findOneAndUpdate(
    { clientId: new mongoose.Types.ObjectId(clientId), _id: contactId },
    { ...updateAttributes, updatedAt: DateHelper.jsDateNowToUnixEpoch(Date.now()) },
    {
      timeStamps: false,
      lean: true,
      new: true,
    },
  );
  return updatedDocument;
};

//------------------------------------------------------------------------------------------------

export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
  const reqClientId = req.query.clientId as string;
  const reqQueryContact = req.params.id;
  const resourceAttributes = req.body.data.attributes;

  //1. find AND update contact
  let contact: IContact | null;
  try {
    contact = await updateContactById(reqClientId, reqQueryContact, resourceAttributes);
    if (!contact) {
      const error: IError = new Error('update failed: possibly clientId / contactId invalid');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err: any) {
    const error: IError = new Error(err.message);
    error.statusCode = err.status;
    return next(error);
  }

  //2. format response
  const response = jsonApiSuccessResponseFromMongooseQuery(contact);
  const formattedResponse = { data: response };

  //3. send response
  return res.status(200).json(formattedResponse);
};
