import { createConnection } from "mysql2/promise";

// Apro la connessione una sola volta all'avvio, riutilizzata da tutti i controller.
const connection = await createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

export default connection;