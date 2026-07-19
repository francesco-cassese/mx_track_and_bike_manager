import { parseResourceId } from '../utils/parseResourceId.js';

/**
 * Verifico che l'id passato come parametro di rotta sia un intero positivo
 * prima di lasciar proseguire la richiesta verso il controller.
 */
const validateId = (req, res, next) => {
    const resourceId = parseResourceId(req.params.id);

    if (resourceId === null) {
        return res.status(400).json({
            success: false,
            message: "Id risorsa non valido"
        });
    }

    req.resourceId = resourceId;
    next();
};

export { validateId };
