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

const MIN_BIKE_YEAR = 1900;

/**
 * Valido i campi del form di creazione/modifica moto. Il backend accetta
 * marca/modello nulli e qualunque anno (colonna YEAR di MySQL), quindi qui
 * applico i vincoli "di buon senso" che l'utente si aspetta da un form.
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

export { validateRegisterForm, validateLoginForm, validateBikeForm };
