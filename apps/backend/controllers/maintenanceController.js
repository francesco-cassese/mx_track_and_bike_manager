import * as maintenanceRepository from '../repositories/maintenanceRepository.js';
import * as sessionRepository from '../repositories/sessionRepository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { calculateRemainingHours, getMaintenanceStatus } from '../utils/maintenance.js';

/**
 * Recupero le scadenze di manutenzione registrate per una singola bike (ownership già verificata da authorizeOwner).
 */
const index = asyncHandler(async (req, res) => {
    const bike_id = req.resourceId;

    const result = await maintenanceRepository.findAllByBikeId(bike_id);

    sendSuccess(res, 200, { data: result });
});

/**
 * Registro una nuova scadenza di manutenzione per una bike (ownership già verificata da authorizeOwner).
 */
const store = asyncHandler(async (req, res) => {
    const bike_id = req.resourceId;
    const { task_description, hour_threshold, last_service_hours, service_date } = req.body;

    // Inserisco la nuova scadenza di manutenzione
    const result = await maintenanceRepository.insert({
        bikeId: bike_id,
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
    const newMaintenance = await maintenanceRepository.findView(result.insertId);

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

    // Eseguo la query per aggiornare la scadenza richiesta
    const result = await maintenanceRepository.update(id, {
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
    const updatedMaintenanceView = await maintenanceRepository.findView(id);

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

    const result = await maintenanceRepository.remove(id);

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
    const bike_id = req.resourceId;

    const [maintenances, totalHours] = await Promise.all([
        maintenanceRepository.findAllByBikeId(bike_id),
        sessionRepository.getTotalHoursByBikeId(bike_id)
    ]);

    // Escludo le manutenzioni senza soglia o ultimo intervento: non è possibile calcolarne lo stato
    const alertList = maintenances
        .filter((m) => m.hour_threshold !== null && m.last_service_hours !== null)
        .map((m) => {
            const remainingHours = calculateRemainingHours(m.hour_threshold, totalHours ?? 0, m.last_service_hours);
            return { ...m, remaining_hours: remainingHours, status: getMaintenanceStatus(remainingHours) };
        })
        .filter((m) => m.status !== 'ok');

    sendSuccess(res, 200, { data: alertList });
});

export { index, store, update, destroy, alerts };
