import connection from "../config/db.js";

/**
 * Recupero un utente tramite email, usato per il login e per verificare i duplicati in registrazione.
 */
const findByEmail = async (email) => {
    const query = `
                SELECT *
                FROM users
                WHERE email = ?`;

    // Recupero l'utente tramite email (prepared statement per prevenire SQL Injection)
    const [rows] = await connection.execute(query, [email]);
    return rows[0];
};

/**
 * Inserisco un nuovo utente con la password già sottoposta a hashing.
 */
const insert = async ({ name, email, passwordHash }) => {
    const query = 'INSERT INTO users (name, email, password_hash) VALUES (?,?,?)';

    // Eseguo la query con prepared statements per prevenire SQL Injection
    const [result] = await connection.execute(query, [name, email, passwordHash]);
    return result;
};

export { findByEmail, insert };
