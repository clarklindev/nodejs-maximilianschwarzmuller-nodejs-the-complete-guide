import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import validate from 'validate.js';

import { validationSchema as AuthSignupValidation } from './authSignup.validation';
import { validationSchema as AuthLoginValidation } from './authLogin.validation';
import { formatValidationErrorsForResponse } from '../global/helpers/formatValidationErrorsForResponse';
import User from '../models/user';
import { ErrorWithStatus } from '../global/interfaces/ErrorWithStatus';

let transporter: nodemailer.Transporter; // Declare the transporter variable outside the function

//function preps mailer to send emails
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }
  return transporter;
};

//try log in
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resourceAttributes = req.body.data.attributes; //gets from frontend

  const validationErrors = validate
    .async(resourceAttributes, AuthLoginValidation)
    .then(
      () => {
        console.log('validated');
      },
      (errors) => {
        console.log('errors:', errors);
        const formattedErrors = formatValidationErrorsForResponse(errors);
        return res.status(422).json({ errors: formattedErrors });
      }
    );

  const { email, password } = resourceAttributes;

  const user = await User.findOne({ email: email });
  if (!user) {
    const error: ErrorWithStatus = new Error('user not found');
    error.statusCode = 401;
    throw error;
  }

  //after this we know email is valid and we have a "user" from db...

  //compare password user entered..
  //the result of compare() is a promise where it returns true if equal and false if not equal.
  const authenticatedUser = await bcrypt.compare(password, user.password);
  if (!authenticatedUser) {
    const error: ErrorWithStatus = new Error('account details invalid');
    error.statusCode = 401;
    throw error;
  }

  console.log('authenticatedUser: ', authenticatedUser);

  const saveInToken = { email: user.email, userId: user._id.toString() }; //save inside token
  const token = await jwt.sign(saveInToken, process.env.JWT_SECRET!, {
    expiresIn: '1h', //manages its own expiration
  });

  console.log('signed token is: ', token);

  // Set the token as an HttpOnly cookie with the Secure flag (only sent over HTTPS)
  res.cookie('token', token, { httpOnly: true, secure: true });
  res.send({ message: 'Login successful', loggedIn: true });
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // clear session
  // callback with potential error as prop
  // if (req.session) {
  //   req.session.destroy((err: Error) => {
  //     if (err) {
  //       console.log(err);
  //       return res.json({ status: 'error', message: err });
  //     }
  //     return res.json({ loggedIn: 'false' });
  //   });
  // }
  // Set the "token" cookie to expire in the past
  res.setHeader(
    'Set-Cookie',
    'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; HttpOnly'
  );
  res.send({ message: 'Logged out successfully.', loggedIn: false });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resourceType = req.body.data.type;
  const resourceAttributes = req.body.data.attributes;

  validate.async(resourceAttributes, AuthSignupValidation).then(
    (attributes) => {
      //success
      console.log('Success!', attributes);
    },
    (errors) => {
      console.log('errors:', errors);
      const formattedErrors = formatValidationErrorsForResponse(errors);
      return res.status(422).json({ errors: formattedErrors });
    }
  );

  const { username, email, password } = resourceAttributes;

  try {
    const hashedPassword = await bcrypt.hash(password, 12); //12 is the salt (amount of times to hash - for more secure password)

    //save in db
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      cart: { items: [] },
      products: [],
    });
    await newUser.save();

    //send mail
    getTransporter().sendMail(
      {
        to: email,
        from: {
          name: 'Clark',
          address: process.env.GMAIL_USER!,
        },
        subject: 'signup succeeded',
        html: '<h1>you successfully signed up</h1>',
      },
      (err: Error | null, info: any) => {
        console.log('success sent email');
      }
    );

    return res.status(201).json({
      status: 'OK',
      data: 'successfully created new user',
      userId: newUser._id,
    });
  } catch (err) {
    console.log('ERROR: ', err);
  }
};

export const resetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //callback with error or buffer

  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      return res.json({ status: 'error', message: err.message });
    }

    //create a token for user asking to reset password
    const token = buffer.toString('hex'); //decodes from hex to string val

    //find matching User account
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ status: 'error', message: 'user not found' });
    }
    //store token on user model
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;

    const result = await user.save();

    //send email
    try {
      const domainUrl =
        process.env.NODE_ENV === 'development'
          ? process.env.DEVELOPMENT_URL
          : process.env.PRODUCTION_URL;

      getTransporter().sendMail(
        {
          to: req.body.email,
          from: {
            name: 'Clark',
            address: process.env.GMAIL_USER!,
          },
          subject: 'password reset',
          html: `<p>you requested a password reset</p>
        <p>Click this <a href="${domainUrl}/auth/reset/${token}">link</a> to set a new password.
      `,
        },
        (err, info) => {
          if (err) {
            return res.json({ status: 'error', message: err });
          }
          return res.json({ status: info, url: domainUrl });
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
};

//on the FRONTEND:
//user enters new password, which is sent as a form post
// at this stage the password reset has already been requested and the user has clicked on the link received in the email
//AND user has entered new password and sent the form..which is now handled by this function.
export const saveNewPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.params.token;

  //new password
  const newPassword = req.body.password;

  //check if there is a user which has a matching token - and expiration date is after the current date (meaning token is still valid)
  //don't need to check what user._id is because on client side would have passed in user._id to this route anyways..
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    return res.json({ status: 'token invalid' });
  }
  //encrypt new password
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    const result = await user.save();
    return res.json({ status: result });
  } catch (err) {
    console.log(err);
  }
};
