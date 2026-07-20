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

export { calculateRemainingHours, getMaintenanceStatus, WARNING_THRESHOLD_HOURS };
