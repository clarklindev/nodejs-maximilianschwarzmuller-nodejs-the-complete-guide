import mongoose, { Query } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
// import validate from 'validate.js'; //NB: do not import directly

import { validationSchema as contactValidation } from './contact.validation';
import { findContact } from '../helpers/findContact';
import validate from '../../../lib/validators';
import Contact from '../../../lib/models/contact';
import { ITenant } from '../../tenants/interfaces/ITenant';
import { IError } from '../../../lib/interfaces/IError';
import { IContact } from '../../../lib/interfaces/IContact';
import DateHelper from '../../../lib/helpers/DateHelper';
import { jsonApiErrorResponseFromValidateJsError } from '../../../lib/helpers/jsonApiErrorResponseFromValidateJsError';
import { jsonApiSuccessResponseFromMongooseQuery } from '../../../lib/helpers/jsonApiSuccessResponseFromMongooseQuery';
import { IJsonApiError } from '../../../lib/interfaces/IJsonApiError';
// temporary..
const tenant: ITenant = {
  email: 'test@gmail.com',
  countryCode: '+27',
  contacts: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// -------------------------------------------------------------------------------------------------
//createContact

const createNewContact = async (contactData: Record<any, any>, clientId: string): Promise<IContact> => {
  const contact = new Contact({
    ...contactData,
    clientId: new mongoose.Types.ObjectId(clientId),
  });
  await contact.save();
  return contact;
};

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  const reqClientId = req.query.clientId as string;

  const resourceAttributes: Record<string, any> = req.body.data.attributes;
  const { email } = resourceAttributes;

  //1. validate data
  try {
    await validate(resourceAttributes, contactValidation(tenant), {
      format: 'detailed',
    });
  } catch (errors: any) {
    const formattedErrors: Array<IJsonApiError> = jsonApiErrorResponseFromValidateJsError(errors);
    return res.status(422).json({ errors: formattedErrors });
  }

  //2. check if contact already exists
  const contact: IContact | null = await findContact(email);
  if (contact) {
    const error: IError = new Error('account exists');
    error.statusCode = 409; //conflict
    return next(error);
  }

  //3. create new contact
  let newContact: IContact;
  try {
    newContact = await createNewContact(resourceAttributes, reqClientId);
  } catch (err: any) {
    const error: IError = new Error('Failed to create contact');
    error.statusCode = 500;
    return next(error);
  }

  //4. format contact response
  const response = jsonApiSuccessResponseFromMongooseQuery(newContact);
  const formattedResponse = { data: response };

  //5. send response
  return res.status(201).json(formattedResponse);
};

// -------------------------------------------------------------------------------------------------
//getContacts

const getContactsByClientId = async (clientId: string): Promise<IContact[]> => {
  return await Contact.find({ clientId }).lean();
};

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

// -------------------------------------------------------------------------------------------------
//getContact

const getContactById = async (clientId: string, contactId: string): Promise<IContact | null> => {
  return await Contact.findOne({ clientId, _id: contactId }).lean();
};

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

// -------------------------------------------------------------------------------------------------
//updateContact

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

export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
  const reqClientId = req.query.clientId as string;
  const reqQueryContact = req.params.id;
  const resourceAttributes = req.body.data.attributes;

  //1. validate data
  const validationErrors = validate(resourceAttributes, contactValidation(tenant), { format: 'detailed' });
  if (validationErrors) {
    const formattedErrors: Array<IJsonApiError> = jsonApiErrorResponseFromValidateJsError(validationErrors);
    return res.status(422).json({ errors: formattedErrors });
  }

  //2. find AND update contact
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

  //3. format response
  const response = jsonApiSuccessResponseFromMongooseQuery(contact);
  const formattedResponse = { data: response };

  //4. send response
  return res.status(200).json(formattedResponse);
};

// -------------------------------------------------------------------------------------------------
//deleteContact

const deleteContactById = async (clientId: string, contactId: string): Promise<IContact | null> => {
  return await Contact.findOneAndDelete({ clientId, _id: contactId });
};

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

// -------------------------------------------------------------------------------------------------
//deleteAllContacts

const deleteAllContactsForClient = async (
  clientId: string,
): Promise<Query<mongoose.mongo.DeleteResult, IContact> | null> => {
  return await Contact.deleteMany({
    clientId: clientId,
  });
};

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
