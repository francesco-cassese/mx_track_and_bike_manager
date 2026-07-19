import connection from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Recupero le sessioni registrate per una singola bike (ownership già verificata da authorizeOwner).
 */
const index = asyncHandler(async (req, res) => {
    const bike_id = req.resourceId;

    const query = `
        SELECT *
        FROM sessions AS s
            JOIN bikes AS b
                ON s.bike_id = b.id
        WHERE s.bike_id = ?
    `

    // Eseguo la query per recuperare le sessioni della bike richiesta
    const [result] = await connection.execute(query, [bike_id]);

    if (result.length === 0) {
        return sendError(res, 404, `Nessuna sessione trovata`);
    }

    sendSuccess(res, 200, { data: result });
});

export { index }
