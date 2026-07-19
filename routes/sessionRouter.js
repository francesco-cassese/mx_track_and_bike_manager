import express from 'express';
import { index } from '../controllers/sessionController.js';

const router = express.Router({ mergeParams: true });

router.get('/', index);

export default router;
