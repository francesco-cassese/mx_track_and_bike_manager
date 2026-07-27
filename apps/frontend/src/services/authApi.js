import { postJson } from "./api";

/**
 * Registro un nuovo utente. Il backend restituisce già un token: la
 * registrazione autentica automaticamente, senza richiedere un login separato.
 */
const register = ({ name, email, password }) => postJson('/auth/register', { name, email, password });

/**
 * Effettuo il login. Restituisco il token al chiamante invece di salvarlo
 * direttamente: la persistenza è responsabilità di AuthContext (login()).
 */
const login = ({ email, password }) => postJson('/auth/login', { email, password });

export { register, login };