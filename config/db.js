import { createPool } from "mysql2/promise";

// Uso un pool invece di una singola connessione: gestisce le richieste concorrenti
// e riconnette automaticamente le connessioni cadute (timeout, riavvio del DB, ecc.),
// cosa che una connection singola non fa.
const pool = createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
})

export default pool;