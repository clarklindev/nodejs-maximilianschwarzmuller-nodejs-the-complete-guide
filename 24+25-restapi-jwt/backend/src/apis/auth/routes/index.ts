import express from 'express';

import { login, signup, resetPassword, saveNewPassword } from '../controllers';
import { checkRequestFormat } from '../../../lib/middleware/checkRequestFormat';
import { isAuth } from '../../../lib/middleware/isAuth';

const router = express.Router();

router.post('/login', checkRequestFormat, login);
router.post('/signup', checkRequestFormat, signup);
router.post('/reset', checkRequestFormat, isAuth, resetPassword);
router.post('/reset/:token', checkRequestFormat, saveNewPassword);

export default router;
