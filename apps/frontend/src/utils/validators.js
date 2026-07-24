const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Valida il formato email, condivisa tra login e registrazione.
 * Ritorna il messaggio d'errore, o null se l'email è valida.
 */
const validateEmail = (email) => {
    if (!email?.trim()) {
        return "L'email è obbligatoria";
    }
    if (!EMAIL_REGEX.test(email.trim())) {
        return "Formato email non valido";
    }
    return null;
};

/**
 * Valido i campi del form di registrazione lato client.
 * Il backend valida solo la presenza dei campi: qui aggiungo controlli
 * di formato/robustezza che il server non applica, oltre alla conferma
 * password (campo che il backend non richiede).
 */
const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
    const errors = {};

    if (!name?.trim()) {
        errors.name = "Il nome è obbligatorio";
    }

    const emailError = validateEmail(email);
    if (emailError) {
        errors.email = emailError;
    }

    if (!password) {
        errors.password = "La password è obbligatoria";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        errors.password = `La password deve contenere almeno ${MIN_PASSWORD_LENGTH} caratteri`;
    }

    if (!confirmPassword) {
        errors.confirmPassword = "La conferma password è obbligatoria";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Le password non coincidono";
    }

    return errors;
};

const validateLoginForm = ({ email, password }) => {

    const errors = {}

    const emailError = validateEmail(email);
    if (emailError) {
        errors.email = emailError;
    }

    if (!password) {
        errors.password = "La password è obbligatoria"
    }

    return errors;
};

const MIN_BIKE_YEAR = 1901;

/**
 * Valido i campi del form di creazione/modifica moto. Il backend accetta
 * marca/modello nulli, ma la colonna YEAR di MySQL accetta solo un range
 * 1901-2155: qui applico lo stesso vincolo, così il form lo segnala prima
 * di arrivare a un errore SQL.
 */
const validateBikeForm = ({ brand, model, year }) => {
    const errors = {};

    if (!brand?.trim()) {
        errors.brand = "La marca è obbligatoria";
    }

    if (!model?.trim()) {
        errors.model = "Il modello è obbligatorio";
    }

    const currentYear = new Date().getFullYear();
    const yearNumber = Number(year);
    if (!year) {
        errors.year = "L'anno è obbligatorio";
    } else if (!Number.isInteger(yearNumber) || yearNumber < MIN_BIKE_YEAR || yearNumber > currentYear + 1) {
        errors.year = `Inserisci un anno tra ${MIN_BIKE_YEAR} e ${currentYear + 1}`;
    }

    return errors;
};

const MAX_TRACK_LENGTH = 100;
const MIN_FEELING = 1;
const MAX_FEELING = 5;

/**
 * Valido i campi del form di creazione/modifica sessione (allenamento).
 * Il backend richiede solo date/track non nulli e accetta qualunque valore
 * per gli altri campi, quindi qui aggiungo i vincoli "di buon senso" che
 * l'utente si aspetta da un form.
 */
const validateSessionForm = ({ date, track, hoursLogged, feeling }) => {
    const errors = {};

    if (!date?.trim()) {
        errors.date = "La data è obbligatoria";
    }

    if (!track?.trim()) {
        errors.track = "La pista è obbligatoria";
    } else if (track.trim().length > MAX_TRACK_LENGTH) {
        errors.track = `La pista non può superare ${MAX_TRACK_LENGTH} caratteri`;
    }

    if (hoursLogged !== "" && hoursLogged !== undefined && hoursLogged !== null) {
        const hoursNumber = Number(hoursLogged);
        if (Number.isNaN(hoursNumber) || hoursNumber < 0) {
            errors.hoursLogged = "Inserisci un numero di ore valido";
        }
    }

    if (feeling !== "" && feeling !== undefined && feeling !== null) {
        const feelingNumber = Number(feeling);
        if (!Number.isInteger(feelingNumber) || feelingNumber < MIN_FEELING || feelingNumber > MAX_FEELING) {
            errors.feeling = `Inserisci una sensazione tra ${MIN_FEELING} e ${MAX_FEELING}`;
        }
    }

    return errors;
};



export { validateRegisterForm, validateLoginForm, validateBikeForm, validateSessionForm };
