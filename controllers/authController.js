import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Gestisco la registrazione di un nuovo utente: eseguo l'hashing
 * della password e salvo l'utente nel database.
 */
const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Valido l'input: mi assicuro che tutti i campi necessari siano presenti
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Tutti i campi sono obbligatori'
        });
    }

    try {
        // Genero l'hash della password con cost factor 12 per bilanciare sicurezza e performance
        const passwordHash = await bcrypt.hash(password, 12);

        const query = 'INSERT INTO users (name, email, password_hash) VALUES (?,?,?)';

        // Eseguo la query con prepared statements per prevenire SQL Injection
        const [result] = await connection.execute(query, [name, email, passwordHash]);

        // Verifico che l'inserimento sia andato a buon fine (affectedRows indica il numero di righe inserite)
        if (result.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "Errore durante il salvataggio dell'utente"
            });
        }

        // Rispondo con successo (201 Created)
        res.status(201).json({
            success: true,
            message: "Utente creato con successo!"
        });

    } catch (error) {
        // Gestisco il caso specifico di violazione di vincoli unici (es. email già esistente)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: "Email già registrata"
            });
        }

        // Registro l'errore lato server per debugging e rispondo in modo generico all'utente
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: "Errore interno del server"
        });
    }
};

/**
 * Gestisco il login di un utente esistente: verifico le credenziali
 * e restituisco un JWT in caso di successo.
 */
const login = async (req, res) => {
    const { email, password } = req.body

    try {

        const query = `
                    SELECT *
                    FROM users
                    WHERE email = ?`;

        // Recupero l'utente tramite email (prepared statement per prevenire SQL Injection)
        const [result] = await connection.execute(query, [email]);

        // Non ho trovato l'utente: rispondo con un messaggio generico per non rivelare quali email sono registrate
        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Credenziali non valide"
            });
        }

        const user = result[0];

        // Confronto la password in chiaro con l'hash salvato nel database
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Credenziali non valide"
            });
        }

        // Genero il JWT con scadenza di 1 ora per autenticare le richieste successive
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

        // Registro l'errore lato server per debugging e rispondo in modo generico all'utente
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Errore interno del server"
        });
    }

}

export { register, login };