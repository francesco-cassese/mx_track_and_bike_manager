import connection from "../config/db.js";

/**
 * Recupero le moto dell'utente loggato
 */
const index = async (req, res) => {
    try {

        const query = `
                SELECT *
                FROM bikes
                WHERE user_id = ?;
        `

        // Eseguo la query per recuperare tutte le bike registrate.
        const [result] = await connection.execute(query, [req.user.id]);

        res.status(200).json({
            success: true,
            data: result
        })

    } catch (error) {

        // Registro l'errore lato server per debugging e rispondo in modo generico all'utente
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Errore interno del server"
        });
    }
}

export { index }