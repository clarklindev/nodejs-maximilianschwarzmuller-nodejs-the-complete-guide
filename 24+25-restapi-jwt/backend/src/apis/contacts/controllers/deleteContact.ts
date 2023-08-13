//deleteContact
import { Request, Response, NextFunction } from 'express';

import Contact from '../../../lib/models/contact';
import { IError } from '../../../lib/interfaces/IError';
import { IContact } from '../../../lib/interfaces/IContact';

const deleteContactById = async (clientId: string, contactId: string): Promise<IContact | null> => {
  return await Contact.findOneAndDelete({ clientId, _id: contactId });
};

//------------------------------------------------------------------------------------------------

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.query.clientId as string;
  const queryContact = req.params.id as string;

  //1. delete contact
  let result: IContact | null;
  try {
    result = await deleteContactById(clientId, queryContact);
  } catch (err: any) {
    const error: IError = new Error('Delete failed');
    error.statusCode = err.status;
    return next(error);
  }

  //2. format result
  // NOTE: findOneAndDelete, findByIdAndDelete, or deleteOne,
  //the returned value is not the actual document object itself. Instead, it's typically a JavaScript object that provides information about the deletion operation, such as the number of documents affected or whether the operation was successful.
  // If you want to access the content of the deleted document itself, including all its properties, you can use the ._doc property on the returned value, just as you would when accessing the document after a query.
  let formattedResponse = {};
  if (result) {
    formattedResponse = {
      data: {
        id: result._id,
        type: 'contact',
        attributes: { ...result._doc },
      },
      meta: {
        message: 'Successfully deleted',
      },
    };
  }

  //3. send response
  return res.status(200).json(formattedResponse);
};
