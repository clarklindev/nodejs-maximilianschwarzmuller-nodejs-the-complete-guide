import { IContact } from '../../../lib/interfaces/IContact';
export interface ITenant {
  email: string;
  name?: string;
  phoneNumber?: string;

  countryCode: string;
  contacts: Array<IContact>;

  createdAt: number;
  updatedAt: number;
}
