import bcrypt from 'bcrypt';
import connection from '../config/db';

const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: 'Tutti i campi sono obbligatori'
        })
        return;
    }

    try {
        const passwordHash = await bcrypt.hash(password, 12);

        const query = 'INSERT INTO users (name, email, password_hash) VALUES (?,?,?)';

        const [result] = await connection.execute(query, [name, email, passwordHash]);

        if (result.affectedRows === 0) {
            res.status(500).json({ error: "Errore durante il salvataggio dell'utente" });
            return;
        }

        res.status(201).json({ message: "Utente creato con successo!" });
    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: "Email già registrata" });
            return;
        }

        console.error(error);
        res.status(500).json({ error: "Errore interno del server" });

    }

}

export default register;