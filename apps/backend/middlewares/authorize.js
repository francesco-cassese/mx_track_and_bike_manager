import connection from '../config/db.js';
import { parseResourceId } from '../utils/parseResourceId.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendError } from '../utils/apiResponse.js';

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

    return asyncHandler(async (req, res, next) => {
        // Mi accerto che a monte sia già passato per authenticateToken.
        if (!req.user) {
            return sendError(res, 401, "Utente non autenticato");
        }

        const resourceId = parseResourceId(req.params.id);

        // Scarto subito id non validi, prima di interrogare il database.
        if (resourceId === null) {
            return sendError(res, 400, "Id risorsa non valido");
        }

        // Recupero il proprietario effettivo della risorsa richiesta.
        const [rows] = await connection.execute(query, [resourceId]);

        if (rows.length === 0) {
            return sendError(res, 404, "Risorsa non trovata");
        }

        // Confronto il proprietario trovato con l'utente autenticato nella richiesta.
        if (rows[0].user_id !== req.user.id) {
            return sendError(res, 403, "Non hai i permessi per modificare questa risorsa");
        }

        // Espongo l'id già parsato al controller, evitando di riparsarlo a valle.
        req.resourceId = resourceId;

        next();
    });
};

export { authorizeOwner };
