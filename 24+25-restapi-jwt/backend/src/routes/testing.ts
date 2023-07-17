import express from 'express';

import { upload } from '../controllers/testing';

const router = express.Router();

router.post('/upload', upload);

export default router;
