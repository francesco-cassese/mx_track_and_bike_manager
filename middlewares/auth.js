import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware di autenticazione: verifica la presenza e validità del JWT
 * nell'header Authorization prima di consentire l'accesso alle rotte protette.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token di accesso mancante"
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            // Distingue token scaduto da token non valido, utile per il frontend
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Token scaduto, effettua nuovamente il login"
                });
            }
            return res.status(403).json({
                success: false,
                message: "Token non valido"
            });
        }

        req.user = decoded;
        next();
    });
};

export { authenticateToken };