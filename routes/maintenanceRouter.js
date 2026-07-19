import express from 'express';
import { index, store, update, destroy } from '../controllers/maintenanceController.js';
import { authorizeOwner } from '../middlewares/authorize.js';

// mergeParams: mi serve accedere a :id della bike, definito nel router padre (bikeRouter)
const router = express.Router({ mergeParams: true });

// Elenco delle scadenze di manutenzione della bike (ownership già verificata a monte da authorizeOwner)
router.get('/', index);

// Registrazione di una nuova scadenza di manutenzione per la bike (ownership già verificata a monte da authorizeOwner)
router.post('/', store);

// Aggiornamento di una scadenza di manutenzione esistente, solo se appartiene all'utente autenticato
router.put('/:id', authorizeOwner('maintenance'), update);

// Eliminazione di una scadenza di manutenzione esistente, solo se appartiene all'utente autenticato
router.delete('/:id', authorizeOwner('maintenance'), destroy);

export default router;
