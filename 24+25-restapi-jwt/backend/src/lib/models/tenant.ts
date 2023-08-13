import mongoose, { Schema } from 'mongoose';

import { ITenant } from '../interfaces/ITenant';
import DateHelper from '../helpers/DateHelper';
import contactSchema from './contact';
const tenantSchema = new Schema<ITenant>(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
    },

    countryCode: {
      type: String,
    },

    contacts: [contactSchema],

    createdAt: {
      type: Number,
      immutable: true, //means cant change
      default: () => DateHelper.jsDateNowToUnixEpoch(Date.now()), //time in seconds since unix epoc
    },

    updatedAt: {
      type: Number,
      default: () => DateHelper.jsDateNowToUnixEpoch(Date.now()), //time in seconds since unix epoc
    },
  },

  { timestamps: false, strict: false, shardKey: { clientId: 1 } }, //1 ascending, -1 descending
);

export default mongoose.model<ITenant>('Tenant', tenantSchema);
