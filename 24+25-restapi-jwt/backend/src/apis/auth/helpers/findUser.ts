import User from '../../../lib/models/user';
import { IUser } from '../../../lib/interfaces/IUser';

export const findUser = async (object: Record<string, any>): Promise<IUser | null> => {
  return await User.findOne(object);
};
