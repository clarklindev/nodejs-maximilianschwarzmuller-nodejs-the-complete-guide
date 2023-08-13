//getContact
import { Request, Response, NextFunction } from 'express';

import Contact from '../../../lib/models/contact';
import { IError } from '../../../lib/interfaces/IError';
import { IContact } from '../../../lib/interfaces/IContact';
import { jsonApiSuccessResponseFromMongooseQuery } from '../../../lib/helpers/jsonApiSuccessResponseFromMongooseQuery';

const getContactById = async (clientId: string, contactId: string): Promise<IContact | null> => {
  return await Contact.findOne({ clientId, _id: contactId }).lean();
};

//------------------------------------------------------------------------------------------------

export const getContact = async (req: Request, res: Response, next: NextFunction) => {
  const reqClientId = req.query.clientId as string; //tenant/client
  const reqQueryContact = req.params.id as string; //what we searching for

  //1. get contact
  let contact: IContact | null;
  try {
    contact = await getContactById(reqClientId, reqQueryContact);
    if (!contact) {
      const error: IError = new Error('Contact not found');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err: any) {
    const error: IError = new Error('Server error');
    error.statusCode = 500;
    return next(error);
  }

  //2. format response
  const response = jsonApiSuccessResponseFromMongooseQuery(contact);
  const formattedResponse = { data: response };

  //3. send response
  return res.status(200).json(formattedResponse);
};
