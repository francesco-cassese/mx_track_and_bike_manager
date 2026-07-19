import connection from "../config/db.js";

/**
 * Recupero le sessioni registrate per una singola bike.
 */
const findAllByBikeId = async (bikeId) => {
    const query = `
        SELECT *
        FROM sessions
        WHERE bike_id = ?
    `

    // Eseguo la query per recuperare le sessioni della bike richiesta
    const [rows] = await connection.execute(query, [bikeId]);
    return rows;
};

/**
 * Recupero una sessione tramite id, da riusare dopo create/update.
 */
const findView = async (id) => {
    const query = `
         SELECT *
         FROM sessions
         WHERE id = ?
        `;

    const [rows] = await connection.execute(query, [id]);
    return rows[0];
};

/**
 * Inserisco una nuova sessione di allenamento associata a una bike
 */
const insert = async ({ bikeId, date, track, weather, feeling, hoursLogged, notes }) => {
    const query = `
    INSERT INTO sessions (
    bike_id,
    date,
    track,
    weather,
    feeling,
    hours_logged,
    notes
    )
    VALUES (?,?,?,?,?,?,?)
    `

    // Eseguo la query per inserire la nuova sessione
    const [result] = await connection.execute(query, [
        bikeId,
        date,
        track,
        weather,
        feeling,
        hoursLogged,
        notes
    ]);

    return result;
};

/**
 * Aggiorno i dati di una singola sessione tramite id
 */
const update = async (id, { date, track, weather, feeling, hoursLogged, notes }) => {
    const query = `
    UPDATE sessions
    SET date = ?,
    track = ?,
    weather = ?,
    feeling = ?,
    hours_logged = ?,
    notes = ?
    WHERE id = ?
    `

    // Eseguo la query per aggiornare la sessione richiesta
    const [result] = await connection.execute(query, [date, track, weather, feeling, hoursLogged, notes, id]);
    return result;

}

/**
 * Elimino una singola sessione tramite id
 */
const remove = async (id) => {
    const query = `
    DELETE
    FROM sessions
    WHERE id = ?
    `

    // Eseguo la query per eliminare la sessione richiesta
    const [result] = await connection.execute(query, [id]);
    return result;
};

export { findAllByBikeId, findView, insert, update, remove };
