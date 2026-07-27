const WARNING_THRESHOLD_HOURS = 10;

/**
 * Calcolo le ore rimanenti prima della soglia di manutenzione.
 */
const calculateRemainingHours = (hourThreshold, totalHours, lastServiceHours) => {
    return hourThreshold - (totalHours - lastServiceHours);
};

/**
 * Determino lo stato di una manutenzione in base alle ore rimanenti.
 */
const getMaintenanceStatus = (remainingHours) => {
    if (remainingHours <= 0) return 'scaduta';
    if (remainingHours <= WARNING_THRESHOLD_HOURS) return 'in_scadenza';
    return 'ok';
};

/**
 * Calcolo gli alert di manutenzione (scadute o in scadenza) per una bike,
 * dati i suoi interventi registrati e il totale ore. Riusata sia dall'endpoint
 * dedicato /bike/:id/alert sia da GET /bike per arricchire ogni moto in
 * un'unica risposta, evitando N richieste separate dal frontend.
 */
const buildAlerts = (maintenances, totalHours) => {
    return maintenances
        .filter((m) => m.hour_threshold !== null && m.last_service_hours !== null)
        .map((m) => {
            const remainingHours = calculateRemainingHours(m.hour_threshold, totalHours ?? 0, m.last_service_hours);
            return { ...m, remaining_hours: remainingHours, status: getMaintenanceStatus(remainingHours) };
        })
        .filter((m) => m.status !== 'ok');
};

export { calculateRemainingHours, getMaintenanceStatus, buildAlerts, WARNING_THRESHOLD_HOURS };
