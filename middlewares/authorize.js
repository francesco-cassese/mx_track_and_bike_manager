/**
 * Middleware di autorizzazione: verifica che l'utente autenticato
 * sia il proprietario della risorsa indicata nei parametri della rotta.
 */
const authorizeOwner = (req, res, next) => {
    const resourceId = parseInt(req.params.id);

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Utente non autenticato"
        });
    }

    if (req.user.id !== resourceId) {
        return res.status(403).json({
            success: false,
            message: "Non hai i permessi per modificare questa risorsa"
        });
    }

    next();
};

export { authorizeOwner };