import { findAllByBikeId, insert, findView, update as updateSession, remove } from "../repositories/sessionRepository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Recupero le sessioni registrate per una singola bike (ownership già verificata da authorizeOwner).
 */
const index = asyncHandler(async (req, res) => {
    const bikeId = req.resourceId;

    // Recupero le sessioni della bike richiesta
    const result = await findAllByBikeId(bikeId);

    sendSuccess(res, 200, { data: result });
});

/**
 * Registro una nuova sessione di allenamento per una bike (ownership già verificata da authorizeOwner).
 */
const store = asyncHandler(async (req, res) => {
    const bikeId = req.resourceId;
    const { date, track, weather, feeling, hours_logged, notes } = req.body;

    // Inserisco la nuova sessione
    const result = await insert({
        bikeId,
        date,
        track,
        weather,
        feeling,
        hoursLogged: hours_logged,
        notes
    });

    // L'inserimento non è andato a buon fine: rispondo con 400
    if (result.affectedRows === 0) {
        return sendError(res, 400, 'Errore nella creazione della sessione di allenamento')
    }

    // Recupero la sessione appena creata per restituirla nella risposta
    const newSession = await findView(result.insertId);

    sendSuccess(res, 200, {
        message: `Sessione aggiunta con successo`,
        data: newSession
    });
})

/**
 * Aggiorno i dati di una singola sessione tramite id (ownership già verificata da authorizeOwner).
 */
const update = asyncHandler(async (req, res) => {
    const id = req.resourceId;
    const { date, track, weather, feeling, hours_logged, notes } = req.body;

    // Eseguo la query per aggiornare la sessione richiesta
    const result = await updateSession(id, {
        date,
        track,
        weather,
        feeling,
        hoursLogged: hours_logged,
        notes
    });

    // Non ho trovato nessuna sessione con questo id: rispondo con 404
    if (result.affectedRows === 0) {
        return sendError(res, 404, 'Nessuna sessione trovata con questo id');
    }

    // Recupero la sessione aggiornata per restituirla nella risposta
    const updateSessionView = await findView(id)

    sendSuccess(res, 200, {
        message: `Le informazioni sulla sessione sono state aggiornate`,
        data: updateSessionView
    });

})

/**
 * Elimino una singola sessione tramite id (ownership già verificata da authorizeOwner).
 */
const destroy = asyncHandler(async (req, res) => {
    const id = req.resourceId;

    // Il repository restituisce già l'OkPacket, non un array: non va destrutturato ulteriormente
    const result = await remove(id);

    // Non ho trovato nessuna sessione con questo id: rispondo con 404
    if (result.affectedRows === 0) {
        return sendError(res, 404, 'Nessuna sessione trovata con questo id')
    }

    sendSuccess(res, 200, { message: 'Sessione eliminata con successo' })

})

export { index, store, update, destroy }
