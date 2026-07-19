import connection from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Recupero la bike (colonne essenziali) tramite id, da riusare dopo create/update.
 */
const getBikeView = async (id) => {
    const query = `
         SELECT id, brand, model, year
         FROM bikes
         WHERE id = ?
        `;

    const [rows] = await connection.execute(query, [id]);
    return rows[0];
};

/**
 * Recupero le moto dell'utente loggato
 */
const index = asyncHandler(async (req, res) => {
    const query = `
            SELECT *
            FROM bikes
            WHERE user_id = ?;
    `

    // Eseguo la query per recuperare tutte le bike registrate.
    const [result] = await connection.execute(query, [req.user.id]);

    sendSuccess(res, 200, { data: result });
});

/**
 * Recupero il dettaglio di una singola moto tramite id
 */
const show = asyncHandler(async (req, res) => {
    const id = req.resourceId;

    const query = `
    SELECT *
    FROM bikes
    WHERE id = ?
`

    // Eseguo la query per recuperare la bike richiesta
    const [result] = await connection.execute(query, [id]);

    // Non ho trovato nessuna moto con questo id: rispondo con 404
    if (result.length === 0) {
        return sendError(res, 404, 'Nessuna moto trovata');
    }

    sendSuccess(res, 200, { data: result });
});

/**
 * Creo una nuova moto associata all'utente loggato
 */
const store = asyncHandler(async (req, res) => {
    const user_id = req.user.id
    const { brand, model, year } = req.body;

    const query = `
        INSERT INTO bikes (
        user_id,
        brand,
        model,
        year
    )
    VALUES (?,?,?,?);
    `;

    // Eseguo la query per inserire la nuova bike
    const [result] = await connection.execute(query, [
        user_id,
        brand,
        model,
        year
    ]);

    // Recupero la bike appena creata per restituirla nella risposta
    const newBikeView = await getBikeView(result.insertId);

    sendSuccess(res, 200, {
        message: `Moto aggiunta con successo`,
        data: newBikeView
    });
});

/**
 * Aggiorno i dati di una singola moto tramite id
 */
const update = asyncHandler(async (req, res) => {
    const id = req.resourceId;
    const { brand, model, year } = req.body;

    const query = `
        UPDATE bikes
        SET brand = ?,
            model = ?,
            year = ?
        WHERE id = ?;
    `

    // Eseguo la query per aggiornare la bike richiesta
    const [result] = await connection.execute(query, [
        brand,
        model,
        year,
        id
    ])

    // Non ho trovato nessuna moto con questo id: rispondo con 404
    if (result.affectedRows === 0) {
        return sendError(res, 404, 'Nessuna moto trovata con questo id');
    }

    // Recupero la bike aggiornata per restituirla nella risposta
    const updatedBikeView = await getBikeView(id);

    sendSuccess(res, 200, {
        message: `Le informazioni sulla moto sono state aggiornate`,
        data: updatedBikeView
    });
});

/**
 * Elimino una singola moto tramite id
 */
const destroy = asyncHandler(async (req, res) => {
    const id = req.resourceId;

    const query = `
    DELETE
    FROM bikes
    WHERE id = ?
    `

    // Eseguo la query per eliminare la bike richiesta
    const [result] = await connection.execute(query, [id]);

    // Non ho trovato nessuna moto con questo id: rispondo con 404
    if (result.affectedRows === 0) {
        return sendError(res, 404, 'Nessuna moto trovata con questo id');
    }

    sendSuccess(res, 200, { message: 'Moto eliminata con successo' });
});

export { index, show, store, update, destroy }
