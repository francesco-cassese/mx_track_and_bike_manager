import connection from '../config/db.js';


/**
 * Recupero le scadenze di manutenzione registrate per una singola bike.
 */
const findAllByBikeId = async (bikeId) => {
    const query = `
            SELECT *
            FROM maintenance
            WHERE bike_id = ?;
    `

    // Eseguo la query per recuperare tutte le bike registrate.
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
 * Inserisco una nuova scadenza di manutenzione associata a una bike
 */
const insert = async ({ bikeId, taskDescription, hourThreshold, lastServiceHours, serviceDate }) => {
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

    // Eseguo la query per inserire la nuova scadenza di manutenzione
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
const update = async (id, { taskDescription, hourThreshold, lastServiceHours, serviceDate }) => {
    const query = `
    UPDATE maintenance
    SET task_description = ?,
    hour_threshold = ?,
    last_service_hours = ?,
    service_date = ?
    WHERE id = ?
    `

    // Eseguo la query per aggiornare la sessione richiesta
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