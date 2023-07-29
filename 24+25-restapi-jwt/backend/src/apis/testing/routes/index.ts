import express from 'express';

import { upload } from '../controllers';

const router = express.Router();

router.post('/upload', upload);

export default router;
