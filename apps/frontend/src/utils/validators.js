const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

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

    if (!email?.trim()) {
        errors.email = "L'email è obbligatoria";
    } else if (!EMAIL_REGEX.test(email.trim())) {
        errors.email = "Formato email non valido";
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

export { validateRegisterForm, MIN_PASSWORD_LENGTH };
