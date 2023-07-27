import User from '../../models/user';

//validate that email is available for use - if found -> fail test
export const emailAvailable = async (value: string) => {
  return new Promise(async function (resolve, reject) {
    const user = await User.findOne({ email: value });
    if (user) {
      resolve('Email already in use');
    }
  });
};
