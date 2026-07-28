import { findAllByUserId, findView, insert, update as updateBike, remove } from "../repositories/bikeRepository.js";
import { getTotalHoursByBikeId } from "../repositories/sessionRepository.js";
import { findAllByBikeId as findMaintenancesByBikeId } from "../repositories/maintenanceRepository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { validateBikeInput } from "../utils/validation.js";
import { buildAlerts } from "../utils/maintenance.js";

/**
 * Arricchisco una bike con ore totali e alert di manutenzione, in un'unica
 * chiamata lato server invece di lasciare che il frontend faccia 2 richieste
 * aggiuntive per moto (pattern N+1 che aveva HomePage in precedenza).
 */
const enrichBike = async (bike) => {
    const [totalHours, maintenances] = await Promise.all([
        getTotalHoursByBikeId(bike.id),
        findMaintenancesByBikeId(bike.id)
    ]);

    return { ...bike, totalHours: totalHours ?? 0, alerts: buildAlerts(maintenances, totalHours) };
};

/**
 * Recupero le moto dell'utente loggato, già arricchite con ore totali e alert
 */
const index = asyncHandler(async (req, res) => {
    const bikes = await findAllByUserId(req.user.id);
    const enrichedBikes = await Promise.all(bikes.map(enrichBike));

    sendSuccess(res, 200, { data: enrichedBikes });
});

/**
 * Recupero il dettaglio di una singola moto tramite id
 */
const show = asyncHandler(async (req, res) => {
    const id = req.resourceId;
    const bike = await findView(id);

    // Non ho trovato nessuna moto con questo id: rispondo con 404
    if (!bike) {
        return sendError(res, 404, 'Nessuna moto trovata');
    }

    const totalHours = await getTotalHoursByBikeId(id);

    sendSuccess(res, 200, { data: { ...bike, totalHours: totalHours ?? 0 } });
});

/**
 * Creo una nuova moto associata all'utente loggato
 */
const store = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const { brand, model, year, vin, status = 'active' } = req.body;

    const validationError = validateBikeInput({ brand, model, year, vin, status });
    if (validationError) {
        return sendError(res, 400, validationError);
    }

    // Eseguo la query per inserire la nuova bike
    const result = await insert({ userId, brand, model, year, vin: vin?.trim() || null, status });

    // Recupero la bike appena creata per restituirla nella risposta
    const newBikeView = await findView(result.insertId);

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
    const { brand, model, year, vin, status = 'active' } = req.body;

    const validationError = validateBikeInput({ brand, model, year, vin, status });
    if (validationError) {
        return sendError(res, 400, validationError);
    }

    // Eseguo la query per aggiornare la bike richiesta
    const result = await updateBike(id, { brand, model, year, vin: vin?.trim() || null, status });

    // Non ho trovato nessuna moto con questo id: rispondo con 404
    if (result.affectedRows === 0) {
        return sendError(res, 404, 'Nessuna moto trovata con questo id');
    }

    // Recupero la bike aggiornata per restituirla nella risposta
    const updatedBikeView = await findView(id);

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
    const result = await remove(id);

    // Non ho trovato nessuna moto con questo id: rispondo con 404
    if (result.affectedRows === 0) {
        return sendError(res, 404, 'Nessuna moto trovata con questo id');
    }

    sendSuccess(res, 200, { message: 'Moto eliminata con successo' });
});

/**
 * Recupero il totale di ore di utilizzo di una singola moto, sommando le sessioni registrate
 */
const totalHours = asyncHandler(async (req, res) => {
    const id = req.resourceId;
    const total = await getTotalHoursByBikeId(id);

    sendSuccess(res, 200, { data: { totalHours: total ?? 0 } });
});

export { index, show, store, update, destroy, totalHours }
