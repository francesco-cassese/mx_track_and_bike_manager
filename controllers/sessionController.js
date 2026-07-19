import * as sessionRepository from "../repositories/sessionRepository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Recupero le sessioni registrate per una singola bike (ownership già verificata da authorizeOwner).
 */
const index = asyncHandler(async (req, res) => {
    const bike_id = req.resourceId;

    // Recupero le sessioni della bike richiesta
    const result = await sessionRepository.findAllByBikeId(bike_id);

    if (result.length === 0) {
        return sendError(res, 404, `Nessuna sessione trovata`);
    }

    sendSuccess(res, 200, { data: result });
});

/**
 * Registro una nuova sessione di allenamento per una bike (ownership già verificata da authorizeOwner).
 */
const store = asyncHandler(async (req, res) => {
    const bike_id = req.resourceId;
    const { date, track, weather, feeling, hours_logged, notes } = req.body;

    // Inserisco la nuova sessione
    const result = await sessionRepository.insert({
        bikeId: bike_id,
        date,
        track,
        weather,
        feeling,
        hoursLogged: hours_logged,
        notes
    });

    if (result.affectedRows === 0) {
        return sendError(res, 400, 'Errore nella creazione della sessione di allenamento')
    }

    // Recupero la sessione appena creata per restituirla nella risposta
    const newSession = await sessionRepository.findView(result.insertId);

    sendSuccess(res, 200, {
        message: `Sessione aggiunta con successo`,
        data: newSession
    });
})

export { index, store }
