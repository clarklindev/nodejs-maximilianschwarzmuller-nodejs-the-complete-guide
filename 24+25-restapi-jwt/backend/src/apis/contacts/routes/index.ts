import express from 'express';

import { isAuth } from '../../../lib/middleware/isAuth';
import { checkRequestFormat } from '../../../lib/middleware/checkRequestFormat';
import {
  createContact,
  getContact,
  updateContact,
  deleteContact,
  getContacts,
  deleteAllContacts,
} from '../controllers';

const router = express.Router();

router.post('/', checkRequestFormat, isAuth, createContact);
router.get('/', isAuth, getContacts);
router.delete('/', isAuth, deleteAllContacts);
router.get('/:id', isAuth, getContact);
router.patch('/:id', checkRequestFormat, isAuth, updateContact);
router.delete('/:id', isAuth, deleteContact);

export default router;
