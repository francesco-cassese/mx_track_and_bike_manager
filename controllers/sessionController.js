import connection from "../config/db.js";

const index = async (req, res) => {
    try {
        const bike_id = req.resourceId;

        const query = `
            SELECT *
            FROM sessions AS s
                JOIN bikes AS b
                    ON s.bike_id = b.id
            WHERE s.bike_id = ?
        `

        const [result] = await connection.execute(query, [bike_id]);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Nessuna sessione trovata`
            })
        }

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