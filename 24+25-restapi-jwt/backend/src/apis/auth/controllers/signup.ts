// signup
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import User from '../../../lib/models/user';
import { getEmailTransporter } from '../../../lib/helpers/getEmailTransporter';
import { IError } from '../../../lib/interfaces/IError';
import { IUser } from '../../../lib/interfaces/IUser';
import { generateToken } from '../../../lib/helpers/generateToken';

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

const saveNewUser = async (username: string, email: string, password: string): Promise<IUser> => {
  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    username,
    email,
    verified: false,
    password: hashedPassword,
    cart: { items: [] },
    products: [],
  });
  return newUser.save();
};

const sendSignupEmail = (email: string) => {
  return new Promise((resolve, reject) => {
    //senMail() has callback syntax
    getEmailTransporter().sendMail(
      {
        to: email,
        from: {
          name: process.env.EMAIL_FROM_NAME as string,
          address: process.env.GMAIL_USER as string,
        },
        subject: 'signup succeeded',
        html: '<h1>you successfully signed up</h1>',
      },
      (err: Error | null, info: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      },
    );
  });
};

//------------------------------------------------------------------------------------------------

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const resourceAttributes = req.body.data.attributes;
  const { username, email, password } = resourceAttributes;

  //1. check if user exists
  let user: IUser | null;
  try {
    user = await User.findOne({ email });
    if (user) {
      const error: IError = new Error('account exists');
      error.statusCode = 409; //conflict
      return next(error);
    }
  } catch (err: any) {
    const error: IError = new Error('Database error');
    error.statusCode = err.status;
    return next(error);
  }

  //2. add new user
  let newUser;
  try {
    newUser = await saveNewUser(username, email, password);
  } catch (err: any) {
    const error: IError = new Error('creating new user failed');
    error.statusCode = err.status;
    return next(error);
  }

  //3. send signup email
  try {
    await sendSignupEmail(email);
  } catch (err: any) {
    const error: IError = new Error('Send signup email failed');
    error.statusCode = err.status;
    return next(error);
  }

  //4. create token for response
  const payload = { username: newUser.username, email: newUser.email, userId: newUser._id.toString(), verified: false };
  let token;
  try {
    token = await generateToken(payload);
  } catch (err: any) {
    const error: IError = new Error('generate token failed');
    error.statusCode = err.status;
    return next(error);
  }

  //5. send response
  const formattedResponse = {
    data: {
      type: 'users',
      id: newUser._id.toString(), //return user._id - this is the important part...
      attributes: {
        username,
        email,
      },
    },
    meta: {
      message: 'User successfully signed up.',
      token,
    },
  };
  return res.status(201).json(formattedResponse);
};
