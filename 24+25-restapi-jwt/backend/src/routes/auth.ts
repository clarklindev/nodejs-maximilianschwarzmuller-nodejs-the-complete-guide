import express from 'express';

import {
  login,
  logout,
  signup,
  resetPassword,
  saveNewPassword,
} from '../controllers/auth';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', signup);
router.post('/reset', resetPassword);
router.post('/reset/:token', saveNewPassword);

export default router;
