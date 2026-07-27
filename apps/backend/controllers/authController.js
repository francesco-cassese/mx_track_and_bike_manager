import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { insert, findByEmail } from '../repositories/userRepository.js';
import { JWT_SECRET } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { isValidEmail, normalizeEmail, validateLoginInput } from '../utils/validation.js';

/**
 * Gestisco la registrazione di un nuovo utente: eseguo l'hashing
 * della password e salvo l'utente nel database.
 */
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Valido l'input: mi assicuro che tutti i campi necessari siano presenti
    if (!name || !email || !password) {
        return sendError(res, 400, 'Tutti i campi sono obbligatori');
    }

    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
        return sendError(res, 400, 'Formato email non valido');
    }

    try {
        // Genero l'hash della password con cost factor 12 per bilanciare sicurezza e performance
        const passwordHash = await bcrypt.hash(password, 12);

        // Salvo il nuovo utente
        const result = await insert({ name, email: normalizedEmail, passwordHash });

        // Verifico che l'inserimento sia andato a buon fine (affectedRows indica il numero di righe inserite)
        if (result.affectedRows === 0) {
            return sendError(res, 500, "Errore durante il salvataggio dell'utente");
        }

        // Genero subito un JWT così l'utente risulta autenticato senza dover rifare il login
        const token = jwt.sign(
            { id: result.insertId, email: normalizedEmail },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Rispondo con successo (201 Created)
        sendSuccess(res, 201, { data: { message: "Utente creato con successo!", token } });

    } catch (error) {
        // Gestisco il caso specifico di violazione di vincoli unici (es. email già esistente)
        if (error.code === 'ER_DUP_ENTRY') {
            return sendError(res, 409, "Email già registrata");
        }

        // Rilancio: gli errori non previsti finiscono nell'error-handler centralizzato
        throw error;
    }
});

/**
 * Gestisco il login di un utente esistente: verifico le credenziali
 * e restituisco un JWT in caso di successo.
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Valido l'input prima di interrogare il database
    const validationError = validateLoginInput({ email, password });
    if (validationError) {
        return sendError(res, 400, validationError);
    }

    // Recupero l'utente tramite email (normalizzata, coerente con il salvataggio in registrazione)
    const user = await findByEmail(normalizeEmail(email));

    // Non ho trovato l'utente: rispondo con un messaggio generico per non rivelare quali email sono registrate
    if (!user) {
        return sendError(res, 401, "Credenziali non valide");
    }

    // Confronto la password in chiaro con l'hash salvato nel database
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
        return sendError(res, 401, "Credenziali non valide");
    }

    // Genero il JWT con scadenza di 1 ora per autenticare le richieste successive
    const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    sendSuccess(res, 200, { data: { message: "Login effettuato!", token } });
});

export { register, login };
