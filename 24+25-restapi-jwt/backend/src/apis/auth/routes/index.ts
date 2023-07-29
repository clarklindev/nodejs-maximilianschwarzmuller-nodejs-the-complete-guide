import express from 'express';

import {
  login,
  logout,
  signup,
  resetPassword,
  saveNewPassword,
  validateToken,
} from '../controllers';

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.post('/signup', signup);
router.post('/reset', resetPassword);
router.post('/reset/:token', saveNewPassword);
router.post('/validatetoken', validateToken);

export default router;
