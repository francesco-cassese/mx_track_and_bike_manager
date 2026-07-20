import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Verifico la presenza e validità del JWT nell'header Authorization
 * prima di consentire l'accesso alle rotte protette.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer TOKEN"

    if (!token) {
        return sendError(res, 401, "Token di accesso mancante");
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            // Distinguo il token scaduto dal token non valido, utile per il frontend
            if (err.name === 'TokenExpiredError') {
                return sendError(res, 401, "Token scaduto, effettua nuovamente il login");
            }
            return sendError(res, 403, "Token non valido");
        }

        req.user = decoded;
        next();
    });
};

export { authenticateToken };
