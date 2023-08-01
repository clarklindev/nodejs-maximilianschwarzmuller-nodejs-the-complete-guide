import express from 'express';

import { login, signup, resetPassword, saveNewPassword } from '../controllers';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/reset', resetPassword);
router.post('/reset/:token', saveNewPassword);

export default router;
