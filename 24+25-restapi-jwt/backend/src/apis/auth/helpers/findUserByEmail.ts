import User from '../../../lib/models/user';
import { IUser } from '../interfaces/IUser';

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email: email });
};
