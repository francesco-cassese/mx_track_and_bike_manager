import bcrypt from 'bcrypt';
import connection from '../config/db';

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

export default register;