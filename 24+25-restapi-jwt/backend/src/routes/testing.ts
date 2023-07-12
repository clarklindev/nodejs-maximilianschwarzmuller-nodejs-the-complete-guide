import express from 'express';

import { Upload } from '../controllers/testing';

const router = express.Router();

router.post('/upload', Upload);

export default router;
