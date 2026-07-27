import { findAllByBikeId, findView, insert, update as updateMaintenance, remove } from '../repositories/maintenanceRepository.js';
import { getTotalHoursByBikeId } from '../repositories/sessionRepository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { buildAlerts } from '../utils/maintenance.js';
import { validateMaintenanceInput } from '../utils/validation.js';

/**
 * Recupero le scadenze di manutenzione registrate per una singola bike (ownership già verificata da authorizeOwner).
 */
const index = asyncHandler(async (req, res) => {
    const bikeId = req.resourceId;

    const result = await findAllByBikeId(bikeId);

    sendSuccess(res, 200, { data: result });
});

/**
 * Recupero il dettaglio di una singola scadenza di manutenzione tramite id (ownership già verificata da authorizeOwner).
 */
const show = asyncHandler(async (req, res) => {
    const id = req.resourceId;
    const maintenance = await findView(id);

    // Non ho trovato nessuna scadenza con questo id: rispondo con 404
    if (!maintenance) {
        return sendError(res, 404, 'Nessuna scadenza di manutenzione trovata con questo id');
    }

    sendSuccess(res, 200, { data: maintenance });
});

/**
 * Registro una nuova scadenza di manutenzione per una bike (ownership già verificata da authorizeOwner).
 */
const store = asyncHandler(async (req, res) => {
    const bikeId = req.resourceId;
    const { task_description, hour_threshold, last_service_hours, service_date } = req.body;

    const validationError = validateMaintenanceInput({ task_description, hour_threshold, last_service_hours });
    if (validationError) {
        return sendError(res, 400, validationError);
    }

    // Inserisco la nuova scadenza di manutenzione
    const result = await insert({
        bikeId,
        taskDescription: task_description,
        hourThreshold: hour_threshold,
        lastServiceHours: last_service_hours,
        serviceDate: service_date
    });

    // L'inserimento non è andato a buon fine: rispondo con 400
    if (result.affectedRows === 0) {
        return sendError(res, 400, 'Errore nella creazione della scadenza di manutenzione');
    }

    // Recupero la scadenza appena creata per restituirla nella risposta
    const newMaintenance = await findView(result.insertId);

    sendSuccess(res, 200, {
        message: `Scadenza di manutenzione aggiunta con successo`,
        data: newMaintenance
    });
});

/**
 * Aggiorno i dati di una singola scadenza di manutenzione tramite id (ownership già verificata da authorizeOwner).
 */
const update = asyncHandler(async (req, res) => {
    const id = req.resourceId;
    const { task_description, hour_threshold, last_service_hours, service_date } = req.body;

    const validationError = validateMaintenanceInput({ task_description, hour_threshold, last_service_hours });
    if (validationError) {
        return sendError(res, 400, validationError);
    }

    // Eseguo la query per aggiornare la scadenza richiesta
    const result = await updateMaintenance(id, {
        taskDescription: task_description,
        hourThreshold: hour_threshold,
        lastServiceHours: last_service_hours,
        serviceDate: service_date
    });

    // Non ho trovato nessuna scadenza con questo id: rispondo con 404
    if (result.affectedRows === 0) {
        return sendError(res, 404, 'Nessuna scadenza di manutenzione trovata con questo id');
    }

    // Recupero la scadenza aggiornata per restituirla nella risposta
    const updatedMaintenanceView = await findView(id);

    sendSuccess(res, 200, {
        message: `Le informazioni sulla scadenza di manutenzione sono state aggiornate`,
        data: updatedMaintenanceView
    });
});

/**
 * Elimino una singola scadenza di manutenzione tramite id (ownership già verificata da authorizeOwner).
 */
const destroy = asyncHandler(async (req, res) => {
    const id = req.resourceId;

    const result = await remove(id);

    // Non ho trovato nessuna scadenza con questo id: rispondo con 404
    if (result.affectedRows === 0) {
        return sendError(res, 404, 'Nessuna scadenza di manutenzione trovata con questo id');
    }

    sendSuccess(res, 200, { message: 'Scadenza di manutenzione eliminata con successo' });
});

/**
 * Recupero le scadenze di manutenzione scadute o in scadenza per una bike (ownership già verificata da authorizeOwner).
 */
const alerts = asyncHandler(async (req, res) => {
    const bikeId = req.resourceId;

    const [maintenances, totalHours] = await Promise.all([
        findAllByBikeId(bikeId),
        getTotalHoursByBikeId(bikeId)
    ]);

    const alertList = buildAlerts(maintenances, totalHours);

    sendSuccess(res, 200, { data: alertList });
});

export { index, show, store, update, destroy, alerts };
