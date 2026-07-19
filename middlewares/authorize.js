import connection from '../config/db.js';

// Definisco, per ogni tipo di risorsa, la query che mi permette di risalire allo user_id proprietario:
// per le bikes lo user_id è diretto, per sessions/maintenance lo eredito dalla bike collegata.
const OWNERSHIP_QUERIES = {
    bike: 'SELECT user_id FROM bikes WHERE id = ?',
    session: 'SELECT b.user_id FROM sessions s JOIN bikes b ON s.bike_id = b.id WHERE s.id = ?',
    maintenance: 'SELECT b.user_id FROM maintenance m JOIN bikes b ON m.bike_id = b.id WHERE m.id = ?'
};

/**
 * Espongo una factory di middleware di autorizzazione: verifico che l'utente autenticato
 * sia il proprietario della risorsa (id nei parametri della rotta), risalendo
 * alla bike collegata per le risorse che non hanno user_id diretto.
 */
const authorizeOwner = (resourceType) => {
    const query = OWNERSHIP_QUERIES[resourceType];

    if (!query) {
        throw new Error(`authorizeOwner: tipo di risorsa sconosciuto "${resourceType}"`);
    }

    return async (req, res, next) => {
        // Mi accerto che a monte sia già passato per authenticateToken.
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Utente non autenticato"
            });
        }

        const resourceId = parseInt(req.params.id, 10);

        // Scarto subito id non numerici, prima di interrogare il database.
        if (Number.isNaN(resourceId)) {
            return res.status(400).json({
                success: false,
                message: "Id risorsa non valido"
            });
        }

        try {
            // Recupero il proprietario effettivo della risorsa richiesta.
            const [rows] = await connection.execute(query, [resourceId]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Risorsa non trovata"
                });
            }

            // Confronto il proprietario trovato con l'utente autenticato nella richiesta.
            if (rows[0].user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "Non hai i permessi per modificare questa risorsa"
                });
            }

            next();
        } catch (error) {
            // Registro l'errore lato server e restituisco un messaggio generico al client.
            console.error('Authorization error:', error);
            res.status(500).json({
                success: false,
                message: "Errore interno del server"
            });
        }
    };
};

export { authorizeOwner };