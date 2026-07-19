import express from "express";
import { destroy, index, show, store, update } from "../controllers/bikeController.js";
import sessionRouter from "./sessionRouter.js";
import { authenticateToken } from "../middlewares/auth.js";
import { authorizeOwner } from "../middlewares/authorize.js";

const router = express.Router();

// Tutte le rotte di questo router richiedono un utente autenticato.
router.use(authenticateToken);

// Elenco delle moto dell'utente autenticato
router.get('/', index);

// Dettaglio di una singola moto, solo se appartiene all'utente autenticato
router.get('/:id', authorizeOwner('bike'), show);

// Sotto-risorsa: sessioni della moto. L'ownership è verificata qui,
// una sola volta, prima di delegare le rotte al router dedicato.
router.use('/:id/sessions', authorizeOwner('bike'), sessionRouter);

// Creazione di una nuova moto associata all'utente autenticato
router.post('/', store)

// Aggiornamento di una moto esistente, solo se appartiene all'utente autenticato
router.put('/:id', authorizeOwner('bike'), update);

// Eliminazione di una moto esistente, solo se appartiene all'utente autenticato
router.delete('/:id', authorizeOwner('bike'), destroy);

export default router;