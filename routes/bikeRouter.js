import express from "express";
import { destroy, index, show, store, update } from "../controllers/bikeContoller.js";
import sessionRouter from "./sessionRouter.js";
import { authenticateToken } from "../middlewares/auth.js";
import { authorizeOwner } from "../middlewares/authorize.js";

const router = express.Router();

// Elenco delle moto dell'utente autenticato
router.get('/', [authenticateToken, index]);

// Dettaglio di una singola moto, solo se appartiene all'utente autenticato
router.get('/:id', [authenticateToken, authorizeOwner('bike'), show]);

// Sotto-risorsa: sessioni della moto. Autenticazione e ownership verificate qui,
// una sola volta, prima di delegare le rotte al router dedicato.
router.use('/:id/sessions', [authenticateToken, authorizeOwner('bike')], sessionRouter);

// Creazione di una nuova moto associata all'utente autenticato
router.post('/', [authenticateToken, store])

// Aggiornamento di una moto esistente, solo se appartiene all'utente autenticato
router.put('/:id', [authenticateToken, authorizeOwner('bike'), update]);

// Eliminazione di una moto esistente, solo se appartiene all'utente autenticato
router.delete('/:id', [authenticateToken, authorizeOwner('bike'), destroy]);

export default router;