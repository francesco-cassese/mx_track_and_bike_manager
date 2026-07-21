import { getJson, postJson, putJson, deleteRequest } from "./api";

/**
 * Recupero le scadenze di manutenzione registrate per una singola moto.
 */
const getMaintenances = (bikeId) => getJson(`/bike/${bikeId}/maintenance`);

/**
 * Registro una nuova scadenza di manutenzione per una moto.
 */
const createMaintenance = (bikeId, { taskDescription, hourThreshold, lastServiceHours, serviceDate }) =>
    postJson(`/bike/${bikeId}/maintenance`, {
        task_description: taskDescription,
        hour_threshold: hourThreshold,
        last_service_hours: lastServiceHours,
        service_date: serviceDate,
    });

/**
 * Aggiorno i dati di una scadenza di manutenzione esistente.
 */
const updateMaintenance = (bikeId, maintenanceId, { taskDescription, hourThreshold, lastServiceHours, serviceDate }) =>
    putJson(`/bike/${bikeId}/maintenance/${maintenanceId}`, {
        task_description: taskDescription,
        hour_threshold: hourThreshold,
        last_service_hours: lastServiceHours,
        service_date: serviceDate,
    });

/**
 * Elimino una scadenza di manutenzione esistente.
 */
const deleteMaintenance = (bikeId, maintenanceId) => deleteRequest(`/bike/${bikeId}/maintenance/${maintenanceId}`);

export { getMaintenances, createMaintenance, updateMaintenance, deleteMaintenance };
