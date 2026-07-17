import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Gestisce la registrazione di un nuovo utente.
 * Esegue l'hashing della password e salva l'utente nel database.
 */
const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Validazione input: assicura che tutti i campi necessari siano presenti
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Tutti i campi sono obbligatori'
        });
    }

    try {
        // Generazione hash della password con cost factor 12 per bilanciare sicurezza e performance
        const passwordHash = await bcrypt.hash(password, 12);

        const query = 'INSERT INTO users (name, email, password_hash) VALUES (?,?,?)';

        // Esecuzione query utilizzando prepared statements per prevenire SQL Injection
        const [result] = await connection.execute(query, [name, email, passwordHash]);

        // Verifica che l'inserimento sia andato a buon fine (affectedRows indica il numero di righe inserite)
        if (result.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "Errore durante il salvataggio dell'utente"
            });
        }

        // Risposta di successo (201 Created)
        res.status(201).json({
            success: true,
            message: "Utente creato con successo!"
        });

    } catch (error) {
        // Gestione specifica per violazione di vincoli unici (es. email già esistente)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: "Email già registrata"
            });
        }

        // Logging dell'errore lato server per debugging e risposta generica all'utente
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: "Errore interno del server"
        });
    }
};

/**
 * Gestisce il login di un utente esistente.
 * Verifica le credenziali e restituisce un JWT in caso di successo.
 */
const login = async (req, res) => {
    const { email, password } = req.body

    try {

        const query = `
                    SELECT *
                    FROM users
                    WHERE email = ?`;

        // Recupero utente tramite email (prepared statement per prevenire SQL Injection)
        const [result] = await connection.execute(query, [email]);

        // Nessun utente trovato: messaggio generico per non rivelare quali email sono registrate
        if (result.length === 0) {
            res.status(401).json({
                success: false,
                message: "Credenziali non valide"
            })
            return;
        }

        const user = result[0];

        // Confronto tra password in chiaro e hash salvato nel database
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            res.status(401).json({
                success: false,
                message: "Credenziali non valide"
            })
            return;
        }

        // Generazione JWT con scadenza di 1 ora per autenticare le richieste successive
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: "Login effettuato!",
            token: token
        });


    } catch (error) {

        // Logging dell'errore lato server per debugging e risposta generica all'utente
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Errore interno del server"
        });
    }

}

export { register, login };