import express from 'express';
import { index } from '../controllers/sessionController.js';

// mergeParams: mi serve accedere a :id della bike, definito nel router padre (bikeRouter)
const router = express.Router({ mergeParams: true });

// Elenco delle sessioni della bike (ownership già verificata a monte da authorizeOwner)
router.get('/', index);

export default router;
