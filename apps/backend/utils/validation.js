const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_BIKE_YEAR = 1901;
const MAX_TRACK_LENGTH = 100;
const MIN_FEELING = 1;
const MAX_FEELING = 5;
const MAX_TASK_DESCRIPTION_LENGTH = 150;

/**
 * Verifico il formato email lato server, senza fidarmi della sola validazione frontend.
 */
const isValidEmail = (email) => EMAIL_REGEX.test(email);

/**
 * Normalizzo l'email prima di salvarla/cercarla, così maiuscole/spazi non creano
 * account duplicati o falsi negativi al login.
 */
const normalizeEmail = (email) => email.trim().toLowerCase();

/**
 * Valido i campi del login. Stesso approccio "un messaggio alla volta" usato in register.
 */
const validateLoginInput = ({ email, password }) => {
    if (!email || !password) {
        return 'Email e password sono obbligatorie';
    }
    if (!isValidEmail(email)) {
        return 'Formato email non valido';
    }
    return null;
};

/**
 * Valido i campi di creazione/modifica moto. Stesso vincolo di anno usato dal
 * frontend (validateBikeForm), oltre al range della colonna YEAR di MySQL.
 */
const validateBikeInput = ({ brand, model, year }) => {
    if (!brand?.trim() || !model?.trim() || !year) {
        return 'Marca, modello e anno sono obbligatori';
    }

    const yearNumber = Number(year);
    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(yearNumber) || yearNumber < MIN_BIKE_YEAR || yearNumber > currentYear + 1) {
        return `L'anno deve essere compreso tra ${MIN_BIKE_YEAR} e ${currentYear + 1}`;
    }

    return null;
};

/**
 * Valido i campi di creazione/modifica sessione. Stessi vincoli usati dal
 * frontend (validateSessionForm): data/pista obbligatorie, ore e sensazione
 * validate solo se presenti.
 */
const validateSessionInput = ({ date, track, hours_logged, feeling }) => {
    if (!date || !track?.trim()) {
        return 'Data e pista sono obbligatorie';
    }
    if (track.trim().length > MAX_TRACK_LENGTH) {
        return `La pista non può superare ${MAX_TRACK_LENGTH} caratteri`;
    }

    if (hours_logged !== undefined && hours_logged !== null && hours_logged !== '') {
        const hoursNumber = Number(hours_logged);
        if (Number.isNaN(hoursNumber) || hoursNumber < 0) {
            return 'Le ore registrate devono essere un numero non negativo';
        }
    }

    if (feeling !== undefined && feeling !== null && feeling !== '') {
        const feelingNumber = Number(feeling);
        if (!Number.isInteger(feelingNumber) || feelingNumber < MIN_FEELING || feelingNumber > MAX_FEELING) {
            return `La sensazione deve essere un numero intero tra ${MIN_FEELING} e ${MAX_FEELING}`;
        }
    }

    return null;
};

/**
 * Valido i campi di creazione/modifica scadenza di manutenzione. Stessi
 * vincoli usati dal frontend (validateMaintenanceForm): descrizione
 * obbligatoria, soglie orarie validate solo se presenti.
 */
const validateMaintenanceInput = ({ task_description, hour_threshold, last_service_hours }) => {
    if (!task_description?.trim()) {
        return "La descrizione dell'intervento è obbligatoria";
    }
    if (task_description.trim().length > MAX_TASK_DESCRIPTION_LENGTH) {
        return `La descrizione non può superare ${MAX_TASK_DESCRIPTION_LENGTH} caratteri`;
    }

    if (hour_threshold !== undefined && hour_threshold !== null && hour_threshold !== '') {
        const hourThresholdNumber = Number(hour_threshold);
        if (Number.isNaN(hourThresholdNumber) || hourThresholdNumber < 0) {
            return 'La soglia oraria deve essere un numero non negativo';
        }
    }

    if (last_service_hours !== undefined && last_service_hours !== null && last_service_hours !== '') {
        const lastServiceHoursNumber = Number(last_service_hours);
        if (Number.isNaN(lastServiceHoursNumber) || lastServiceHoursNumber < 0) {
            return "Le ore dell'ultimo intervento devono essere un numero non negativo";
        }
    }

    return null;
};

export {
    isValidEmail,
    normalizeEmail,
    validateLoginInput,
    validateBikeInput,
    validateSessionInput,
    validateMaintenanceInput,
};
