import express from 'express';

import { login, signup, resetPassword, saveNewPassword } from '../controllers';
import { checkRequestFormat } from '../../../lib/middleware/checkRequestFormat';
import { isAuth } from '../../../lib/middleware/isAuth';
import { validationSchema as authLoginValidation } from './authLogin.validation';
import { validationSchema as authSignupValidation } from './authSignup.validation';
import { validateRequestData } from '../../../lib/middleware/validateRequestData';

const router = express.Router();

router.post('/login', checkRequestFormat, validateRequestData(authLoginValidation), login);
router.post('/signup', checkRequestFormat, validateRequestData(authSignupValidation), signup);
router.post('/reset', checkRequestFormat, isAuth, resetPassword);
router.post('/reset/:token', checkRequestFormat, saveNewPassword);

export default router;
