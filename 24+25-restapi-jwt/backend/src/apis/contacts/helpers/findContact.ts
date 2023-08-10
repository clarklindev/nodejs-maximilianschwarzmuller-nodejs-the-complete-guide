import Contact from '../../../lib/models/contact';
import { IContact } from '../../../lib/interfaces/IContact';

//function receives object with query attributes...eg. {email:"abc@gmail.com"}
export const findContact = async (object: Record<string, any>): Promise<IContact | null> => {
  return await Contact.findOne(object);
};
