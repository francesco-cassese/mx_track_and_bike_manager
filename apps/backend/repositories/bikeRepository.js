import connection from "../config/db.js";

/**
 * Recupero le moto dell'utente loggato
 */
const findAllByUserId = async (userId) => {
    const query = `
            SELECT *
            FROM bikes
            WHERE user_id = ?;
    `

    // Eseguo la query per recuperare tutte le bike registrate.
    const [rows] = await connection.execute(query, [userId]);
    return rows;
};

/**
 * Recupero la bike (colonne essenziali) tramite id.
 */
const findView = async (id) => {
    const query = `
         SELECT id, brand, model, year
         FROM bikes
         WHERE id = ?
        `;

    const [rows] = await connection.execute(query, [id]);
    return rows[0];
};

/**
 * Inserisco una nuova moto associata all'utente loggato
 */
const insert = async ({ userId, brand, model, year }) => {
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
    const [result] = await connection.execute(query, [userId, brand, model, year]);
    return result;
};

/**
 * Aggiorno i dati di una singola moto tramite id
 */
const update = async (id, { brand, model, year }) => {
    const query = `
        UPDATE bikes
        SET brand = ?,
            model = ?,
            year = ?
        WHERE id = ?;
    `

    // Eseguo la query per aggiornare la bike richiesta
    const [result] = await connection.execute(query, [brand, model, year, id]);
    return result;
};

/**
 * Elimino una singola moto tramite id
 */
const remove = async (id) => {
    const query = `
    DELETE
    FROM bikes
    WHERE id = ?
    `

    // Eseguo la query per eliminare la bike richiesta
    const [result] = await connection.execute(query, [id]);
    return result;
};

export { findAllByUserId, findView, insert, update, remove };
