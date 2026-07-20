import { postJson } from "./api";

/**
 * Registro un nuovo utente. Non salvo alcun token: la registrazione
 * non autentica automaticamente, l'utente deve poi effettuare il login.
 */
const register = ({ name, email, password }) => postJson('/auth/register', { name, email, password });

/**
 * Effettuo il login. Restituisco il token al chiamante invece di salvarlo
 * direttamente: la persistenza è responsabilità di AuthContext (login()).
 */
const login = ({ email, password }) => postJson('/auth/login', { email, password });

export { register, login };