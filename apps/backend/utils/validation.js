const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Verifico il formato email lato server, senza fidarmi della sola validazione frontend.
 */
const isValidEmail = (email) => EMAIL_REGEX.test(email);

/**
 * Normalizzo l'email prima di salvarla/cercarla, così maiuscole/spazi non creano
 * account duplicati o falsi negativi al login.
 */
const normalizeEmail = (email) => email.trim().toLowerCase();

export { isValidEmail, normalizeEmail };
