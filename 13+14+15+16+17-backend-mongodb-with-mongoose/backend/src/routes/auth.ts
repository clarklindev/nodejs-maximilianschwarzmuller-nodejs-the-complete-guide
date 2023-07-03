import express from 'express';

import {getLogin, postLogin, postLogout, postSignup, postResetPassword, postNewPassword} from '../controllers/auth';
import { body } from 'express-validator';
import User from '../models/user';

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password', 'password has to be valid')
    .isLength({ min: 6 })
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

router.get('/login', validateLogin, getLogin);
router.post('/login', postLogin);

router.post('/logout', postLogout);
router.post('/signup', validateSignup, postSignup);

router.post('/reset', postResetPassword);
router.post('/reset/:token', postNewPassword);

export default router;