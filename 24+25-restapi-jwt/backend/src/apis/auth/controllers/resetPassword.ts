//resetPassword
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

import User from '../../../lib/models/user';
import { getEmailTransporter } from '../../../lib/helpers/getEmailTransporter';
import { IError } from '../../../lib/interfaces/IError';
import { IUser } from '../../../lib/interfaces/IUser';

const generateRandomBytes = (length: number) => {
  return new Promise((resolve, reject) => {
    //randomBytes() uses callback syntax
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      return resolve(buffer);
    });
  });
};

const createResetToken = async () => {
  const length = 32;
  const buffer = await generateRandomBytes(length);
  return (buffer as Buffer).toString('hex');
};

const updateUserResetToken = async (user: IUser, token: string) => {
  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 60 * 60 * 1000; //UTC time + 1 hour (in milliseconds)
  return user.save();
};

const sendResetPasswordEmail = async (email: string, token: string) => {
  return await getEmailTransporter().sendMail({
    to: email,
    from: {
      name: process.env.EMAIL_FROM as string,
      address: process.env.GMAIL_USER as string,
    },
    subject: 'password reset',

    // should be a frontend link or use postman with backend link
    html: `<p>you requested a password reset</p>
        <p>Click this <a href="${process.env.URL}:${process.env.PORT}/auth/reset/${token}">link</a> to set a new password.
      `,
  });
};

//------------------------------------------------------------------------------------------------

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const resourceAttributes = req.body.data.attributes;
  const { email } = resourceAttributes;

  //1. create reset token
  let token;
  try {
    token = await createResetToken();
  } catch (err: any) {
    // Set the HTTP status code to 500 for Internal Server Error
    const error: IError = new Error(err.message);
    error.statusCode = err.status;
    return next(error);
  }

  //2. find user
  let user: IUser | null;
  try {
    user = await User.findOne({ email });
  } catch (err: any) {
    const error: IError = new Error('user not found');
    error.statusCode = err.status;
    return next(error);
  }

  //3. update reset token
  try {
    await updateUserResetToken(user as IUser, token);
  } catch (err) {
    return next(err);
  }

  //4. send reset password email
  try {
    await sendResetPasswordEmail(email, token);
  } catch (err: any) {
    const error: IError = new Error('failed to send email');
    error.statusCode = err.status;
    return next(error);
  }

  //5. send response
  const formattedResponse = {
    data: {
      type: 'success',
      attributes: {
        email: email,
      },
    },
    meta: {
      status: 'success',
    },
  };
  return res.json(formattedResponse);
};
