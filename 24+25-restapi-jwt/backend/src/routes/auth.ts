import express from 'express';

import {
  login,
  logout,
  signup,
  resetPassword,
  saveNewPassword,
} from '../controllers/auth';
import { body } from 'express-validator';
import User from '../models/user';

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('password', 'password has to be valid')
    .isLength({ min: 3 })
    .isAlphanumeric()
    .trim(),
];

const validateSignup = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  body(
    'password',
    'please enter a password with only numbers and text and atleast 6 chars' //default message for all validators below
  )
    .isLength({ min: 6 })
    .isAlphanumeric()
    .trim(), //check password value in body of request
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    }),
];

const router = express.Router();

router.post('/login', validateLogin, login);

router.post('/logout', logout);
router.post('/signup', validateSignup, signup);

router.post('/reset', resetPassword);
router.post('/reset/:token', saveNewPassword);

export default router;
