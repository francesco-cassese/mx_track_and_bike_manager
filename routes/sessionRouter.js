import express from 'express';
import { index, store, update, destroy } from '../controllers/sessionController.js';
import { authorizeOwner } from '../middlewares/authorize.js';

// mergeParams: mi serve accedere a :id della bike, definito nel router padre (bikeRouter)
const router = express.Router({ mergeParams: true });

// Elenco delle sessioni della bike (ownership già verificata a monte da authorizeOwner)
router.get('/', index);

// Registrazione di una nuova sessione per la bike (ownership già verificata a monte da authorizeOwner)
router.post('/', store);

// Aggiornamento di una sessione esistente, solo se appartiene all'utente autenticato
router.put('/:id', authorizeOwner('session'), update);

// Eliminazione di una sessione esistente, solo se appartiene all'utente autenticato
router.delete('/:id', authorizeOwner('session'), destroy)

export default router;
