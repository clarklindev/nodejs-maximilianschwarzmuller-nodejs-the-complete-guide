import mongoose, { Document } from 'mongoose'; //import is NB

export interface IContact extends Document {
  email: string;
  clientId: mongoose.Types.ObjectId;
  createdAt: number;
  updatedAt: number;

  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  defaultCountryCode?: string;
  _doc?: any;
}
