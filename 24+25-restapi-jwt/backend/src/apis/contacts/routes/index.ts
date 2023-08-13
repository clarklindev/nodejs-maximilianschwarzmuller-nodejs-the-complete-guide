import express from 'express';

import { validationSchema as contactValidation } from './contact.validation';
import { isAuth } from '../../../lib/middleware/isAuth';
import { checkRequestFormat } from '../../../lib/middleware/checkRequestFormat';
import { validateRequestData } from '../../../lib/middleware/validateRequestData';
import { ITenant } from '../../../lib/interfaces/ITenant';
import {
  createContact,
  getContact,
  updateContact,
  deleteContact,
  getContacts,
  deleteAllContacts,
} from '../controllers';

// temporary..
const tenant: ITenant = {
  email: 'test@gmail.com',
  countryCode: '+27',
  contacts: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const router = express.Router();

router.post('/', checkRequestFormat, isAuth, validateRequestData(contactValidation(tenant)), createContact);
router.get('/', isAuth, getContacts);
router.delete('/', isAuth, deleteAllContacts);
router.get('/:id', isAuth, getContact);
router.patch('/:id', checkRequestFormat, isAuth, validateRequestData(contactValidation(tenant)), updateContact);
router.delete('/:id', isAuth, deleteContact);

export default router;
