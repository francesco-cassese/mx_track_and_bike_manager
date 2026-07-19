import * as bikeRepository from "../repositories/bikeRepository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Recupero le moto dell'utente loggato
 */
const index = asyncHandler(async (req, res) => {
    const result = await bikeRepository.findAllByUserId(req.user.id);

    sendSuccess(res, 200, { data: result });
});

/**
 * Recupero il dettaglio di una singola moto tramite id
 */
const show = asyncHandler(async (req, res) => {
    const id = req.resourceId;
    const result = await bikeRepository.findById(id);

    // Non ho trovato nessuna moto con questo id: rispondo con 404
    if (result.length === 0) {
        return sendError(res, 404, 'Nessuna moto trovata');
    }

    sendSuccess(res, 200, { data: result });
});

/**
 * Creo una nuova moto associata all'utente loggato
 */
const store = asyncHandler(async (req, res) => {
    const user_id = req.user.id
    const { brand, model, year } = req.body;

    // Eseguo la query per inserire la nuova bike
    const result = await bikeRepository.insert({ userId: user_id, brand, model, year });

    // Recupero la bike appena creata per restituirla nella risposta
    const newBikeView = await bikeRepository.findView(result.insertId);

    sendSuccess(res, 200, {
        message: `Moto aggiunta con successo`,
        data: newBikeView
    });
});

/**
 * Aggiorno i dati di una singola moto tramite id
 */
const update = asyncHandler(async (req, res) => {
    const id = req.resourceId;
    const { brand, model, year } = req.body;

    // Eseguo la query per aggiornare la bike richiesta
    const result = await bikeRepository.update(id, { brand, model, year });

    // Non ho trovato nessuna moto con questo id: rispondo con 404
    if (result.affectedRows === 0) {
        return sendError(res, 404, 'Nessuna moto trovata con questo id');
    }

    // Recupero la bike aggiornata per restituirla nella risposta
    const updatedBikeView = await bikeRepository.findView(id);

    sendSuccess(res, 200, {
        message: `Le informazioni sulla moto sono state aggiornate`,
        data: updatedBikeView
    });
});

/**
 * Elimino una singola moto tramite id
 */
const destroy = asyncHandler(async (req, res) => {
    const id = req.resourceId;

    // Eseguo la query per eliminare la bike richiesta
    const result = await bikeRepository.remove(id);

    // Non ho trovato nessuna moto con questo id: rispondo con 404
    if (result.affectedRows === 0) {
        return sendError(res, 404, 'Nessuna moto trovata con questo id');
    }

    sendSuccess(res, 200, { message: 'Moto eliminata con successo' });
});

export { index, show, store, update, destroy }
