//getContacts
import { Request, Response, NextFunction } from 'express';

import Contact from '../../../lib/models/contact';
import { IError } from '../../../lib/interfaces/IError';
import { jsonApiSuccessResponseFromMongooseQuery } from '../../../lib/helpers/jsonApiSuccessResponseFromMongooseQuery';
import { IContact } from '../../../lib/interfaces/IContact';

const getContactsByClientId = async (clientId: string): Promise<IContact[]> => {
  return await Contact.find({ clientId }).lean();
};

//------------------------------------------------------------------------------------------------

export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  const reqClientId = req.query.clientId as string;

  //1. get contacts
  let contacts: Array<IContact>;
  try {
    contacts = await getContactsByClientId(reqClientId);
  } catch (err: any) {
    const error: IError = new Error('Failed to fetch contacts');
    error.statusCode = 404;
    return next(err);
  }

  //2. format response
  const response = contacts.map((contact) => {
    return jsonApiSuccessResponseFromMongooseQuery(contact);
  });
  const formattedResponse = { data: response };

  //3. send response
  return res.status(200).json(formattedResponse);
};
