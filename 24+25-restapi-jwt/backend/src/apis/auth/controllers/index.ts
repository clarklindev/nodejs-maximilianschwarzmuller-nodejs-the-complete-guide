import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Document } from 'mongoose';
// import validate from 'validate.js';  //NB: dont import validate directly

import { validationSchema as authSignupValidation } from './authSignup.validation';
import { validationSchema as authLoginValidation } from './authLogin.validation';
import validate from '../../../lib/validators';
import User from '../../../lib/models/user';
import { makeJsonapiErrorsResponse } from '../../../lib/helpers/makeJsonapiErrorsResponse';
import { IValidatejsError } from '../../../lib/helpers/makeJsonapiErrorsResponse';
import { findUserByEmail } from '../helpers/findUserByEmail';
import { getEmailTransporter } from '../../../lib/helpers/getEmailTransporter';
import { IError } from '../../../lib/interfaces/IError';
import { IUser } from '../interfaces/IUser';

// -------------------------------------------------------------------------------------------------

// login

const authenticateUser = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateToken = async (payload: any) => {
  return await jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: '1h',
  });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const resourceAttributes = req.body.data.attributes;
  const { email, password } = resourceAttributes;

  //1. validate
  try {
    await validate.async(resourceAttributes, authLoginValidation, {
      format: 'detailed',
    } as validate.AsyncValidateOption);
  } catch (errors: any) {
    const formattedErrors = makeJsonapiErrorsResponse(errors as Array<IValidatejsError>);
    return res.status(422).json({ errors: formattedErrors });
  }

  //2. make sure user exists
  const user: IUser | null = await findUserByEmail(email);
  if (!user) {
    const error: IError = new Error('user does not exist');
    error.statusCode = 404;
    return next(error);
  }

  //3. authenticate user
  const authenticated = await authenticateUser(password, user.password);
  if (!authenticated) {
    const error: IError = new Error('account details invalid');
    error.statusCode = 401;
    return next(error);
  }

  //4. generate token
  const saveInToken = { username: user.username, email: user.email, userId: user._id.toString() };
  let token;
  try {
    token = await generateToken(saveInToken);
  } catch (err: any) {
    const error: IError = new Error('generate token failed');
    error.statusCode = err.status;
    return next(error);
  }

  //5. send response including token
  const formattedResponse = {
    data: {
      id: user._id.toString(),
      type: 'user',
      attributes: {
        username: user.username,
        email: user.email,
      },
    },
    meta: {
      token,
      message: 'User successfully logged in.',
    },
  };
  return res.status(200).json(formattedResponse);
};

// -------------------------------------------------------------------------------------------------
// signup

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

const saveNewUser = async (username: string, email: string, password: string): Promise<IUser> => {
  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    username,
    email,
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
      }
    );
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const resourceAttributes = req.body.data.attributes;
  const { username, email, password } = resourceAttributes;

  //1. validate
  try {
    await validate.async(resourceAttributes, authSignupValidation, {
      format: 'detailed',
    } as validate.AsyncValidateOption);
  } catch (errors: any) {
    const response = makeJsonapiErrorsResponse(errors as Array<IValidatejsError>);
    const formattedResponse = { errors: response };

    return res.status(422).json(formattedResponse);
  }

  //2. check if user exists
  const user: IUser | null = await findUserByEmail(email);
  if (user) {
    const error: IError = new Error('account exists');
    error.statusCode = 409; //conflict
    return next(error);
  }

  //3. add new user
  let newUser;
  try {
    newUser = await saveNewUser(username, email, password);
  } catch (err: any) {
    const error: IError = new Error('creating new user failed');
    error.statusCode = err.status;
    return next(error);
  }

  //4. send signup email
  try {
    await sendSignupEmail(email);
  } catch (err: any) {
    const error: IError = new Error('Send signup email failed');
    error.statusCode = err.status;
    return next(error);
  }

  //6. send response
  const formattedResponse = {
    data: {
      type: 'users',
      id: newUser._id.toString(),
      attributes: {
        username,
        email,
      },
    },
    meta: {
      message: 'User successfully signed up.',
    },
  };
  return res.status(201).json(formattedResponse);
};

// -------------------------------------------------------------------------------------------------
//resetPassword

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
  user.resetTokenExpiration = Date.now() + 3600000;
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
    user = await findUserByEmail(email);
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

// -------------------------------------------------------------------------------------------------
//saveNewPassword

const encryptPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

const updateUserPassword = async (user: IUser, hashedPassword: string) => {
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  return user.save();
};

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
