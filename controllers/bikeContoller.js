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

/**
 * Recupero il dettaglio di una singola moto tramite id
 */
const show = async (req, res) => {

    try {

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
            return res.status(404).json({
                success: false,
                message: 'Nessuna moto trovata'
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

/**
 * Creo una nuova moto associata all'utente loggato
 */
const store = async (req, res) => {
    try {

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

        const viewQuery = `
         SELECT id, brand, model, year
         FROM bikes
         WHERE id = ?
        `

        // Recupero la bike appena creata per restituirla nella risposta
        const [newBikeView] = await connection.execute(viewQuery, [result.insertId]);

        return res.status(200).json({
            success: true,
            message: `Moto aggiunta con successo`,
            data: newBikeView[0]
        });

    } catch (error) {

        // Registro l'errore lato server per debugging e rispondo in modo generico all'utente
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Errore interno del server"
        });
    }
}

/**
 * Aggiorno i dati di una singola moto tramite id
 */
const update = async (req, res) => {
    try {

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
            return res.status(404).json({
                success: false,
                message: 'Nessuna moto trovata con questo id'
            })
        }

        const viewQuery = `
         SELECT id, brand, model, year
         FROM bikes
         WHERE id = ?
        `

        // Recupero la bike aggiornata per restituirla nella risposta
        const [updatedBikeView] = await connection.execute(viewQuery, [id]);

        res.status(200).json({
            success: true,
            message: `Le informazioni sulla moto sono state aggiornate`,
            data: updatedBikeView[0]
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

export { index, show, store, update }
