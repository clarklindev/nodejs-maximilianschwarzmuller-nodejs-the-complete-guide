import User from '../../models/user';

export const emailExists = async (value) => {
  return new Promise(async function (resolve, reject) {
    const user = await User.findOne({ email: value });
    if (user) {
      resolve('Email already in use');
    }
    resolve();
  });
};
