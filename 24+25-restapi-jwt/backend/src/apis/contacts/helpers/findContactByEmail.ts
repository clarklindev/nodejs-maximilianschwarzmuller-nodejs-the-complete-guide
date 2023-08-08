import Contact from '../../../lib/models/contact';
import { IContact } from '../interfaces/IContact';

export const findContactByEmail = async (email: string): Promise<IContact | null> => {
  return await Contact.findOne({ email: email });
};
