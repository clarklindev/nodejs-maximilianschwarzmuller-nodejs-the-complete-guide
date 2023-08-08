import User from '../models/user';

//validate that email is available for use - if found -> fail test
export const emailAvailable = async (value: string) => {
  const user = await User.findOne({ email: value });
  if (user) {
    return 'Email already in use';
  }
};
