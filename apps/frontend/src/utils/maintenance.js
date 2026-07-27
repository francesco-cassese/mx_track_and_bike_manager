// ATTENZIONE: duplicata in apps/backend/utils/maintenance.js (stesso nome/valore).
// Se cambi questa soglia aggiornala anche lì, altrimenti gli stati mostrati
// qui e gli alert calcolati lato server finiscono per disallinearsi.
const WARNING_THRESHOLD_HOURS = 10;

/**
 * Calcolo le ore rimanenti prima della soglia di manutenzione, rispecchiando
 * la stessa logica del backend (apps/backend/utils/maintenance.js) così la
 * lista mostra lo stato coerente con quello usato per gli alert.
 */
const calculateRemainingHours = (hourThreshold, totalHours, lastServiceHours) => {
    return hourThreshold - (totalHours - lastServiceHours);
};

/**
 * Determino lo stato di una manutenzione in base alle ore rimanenti.
 * Ritorna null quando mancano i dati per calcolarlo (soglia o ultimo
 * intervento non impostati), stato che il chiamante mostra come "n/d".
 */
const getMaintenanceStatus = (hourThreshold, totalHours, lastServiceHours) => {
    if (hourThreshold === null || hourThreshold === undefined || lastServiceHours === null || lastServiceHours === undefined) {
        return null;
    }

    const remainingHours = calculateRemainingHours(hourThreshold, totalHours ?? 0, lastServiceHours);
    if (remainingHours <= 0) return "scaduta";
    if (remainingHours <= WARNING_THRESHOLD_HOURS) return "in_scadenza";
    return "ok";
};

const MAINTENANCE_STATUS_LABELS = {
    ok: "OK",
    in_scadenza: "In scadenza",
    scaduta: "Scaduta"
};

export { calculateRemainingHours, getMaintenanceStatus, MAINTENANCE_STATUS_LABELS, WARNING_THRESHOLD_HOURS };
