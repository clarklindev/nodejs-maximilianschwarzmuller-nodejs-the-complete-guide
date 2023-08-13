//saveNewPassword
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import User from '../../../lib/models/user';
import { IError } from '../../../lib/interfaces/IError';
import { IUser } from '../../../lib/interfaces/IUser';

const encryptPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

const updateUserPassword = async (user: IUser, hashedPassword: string) => {
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  return user.save();
};

//------------------------------------------------------------------------------------------------

export const saveNewPassword = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.params.token;
  const resourceAttributes = req.body.data.attributes;
  const { password: newPassword } = resourceAttributes; //password renamed as newPassword

  //1. find a user in db - where they have the same resetToken (from req.params.token) + not expired
  const user: IUser | null = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    const error: IError = new Error('Unauthorized');
    error.statusCode = 401;
    return next(error);
  }

  //3. encrypt user entered password
  let hashedPassword;
  try {
    hashedPassword = await encryptPassword(newPassword);
  } catch (err: any) {
    const error: IError = new Error('Failed to encrypt password');
    error.statusCode = err.status;
    return next(error);
  }

  //4. update password
  try {
    if (hashedPassword) {
      await updateUserPassword(user, hashedPassword);
    }
  } catch (err: any) {
    const error: IError = new Error('update details failed');
    error.statusCode = err.status;
    return next(error);
  }

  //5. send response
  const formattedResponse = {
    data: {
      type: 'users',
      id: user._id.toString(),
      attributes: {
        username: user.username,
      },
    },
  };

  return res.status(200).json(formattedResponse);
};
