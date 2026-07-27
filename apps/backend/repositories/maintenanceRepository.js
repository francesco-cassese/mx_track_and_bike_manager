import connection from '../config/db.js';


/**
 * Recupero le scadenze di manutenzione registrate per una singola moto.
 */
const findAllByBikeId = async (bikeId) => {
    const query = `
            SELECT *
            FROM maintenance
            WHERE bike_id = ?;
    `

    // Eseguo la query per recuperare tutte le moto registrate.
    const [rows] = await connection.execute(query, [bikeId]);
    return rows;
};

/**
 * Recupero una scadenza di manutenzione tramite id.
 */
const findView = async (id) => {
    const query = `
         SELECT *
         FROM maintenance
         WHERE id = ?
        `;

    const [rows] = await connection.execute(query, [id]);
    return rows[0];
};

/**
 * Inserisco una nuova scadenza di manutenzione associata a una moto
 */
const insert = async ({ bikeId, taskDescription, hourThreshold = null, lastServiceHours = null, serviceDate = null }) => {
    const query = `
    INSERT INTO maintenance (
    bike_id,
    task_description,
    hour_threshold,
    last_service_hours,
    service_date
    )
    VALUES (?,?,?,?,?)
    `

    // Inserisco la nuova scadenza di manutenzione
    const [result] = await connection.execute(query, [
        bikeId,
        taskDescription,
        hourThreshold,
        lastServiceHours,
        serviceDate
    ]);

    return result;
};

/**
 * Aggiorno i dati di una singola scadenza di manutenzione tramite id
 */
const update = async (id, { taskDescription, hourThreshold = null, lastServiceHours = null, serviceDate = null }) => {
    const query = `
    UPDATE maintenance
    SET task_description = ?,
    hour_threshold = ?,
    last_service_hours = ?,
    service_date = ?
    WHERE id = ?
    `

    // Aggiorno la scadenza richiesta
    const [result] = await connection.execute(query, [taskDescription, hourThreshold, lastServiceHours, serviceDate, id]);
    return result;

}

/**
 * Elimino una singola scadenza di manutenzione tramite id
 */
const remove = async (id) => {
    const query = `
    DELETE
    FROM maintenance
    WHERE id = ?
    `

    // Eseguo la query per eliminare la sessione richiesta
    const [result] = await connection.execute(query, [id]);
    return result;
};


export { findAllByBikeId, findView, insert, update, remove }