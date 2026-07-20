/**
 * Centralizzo la lettura delle variabili d'ambiente critiche: fallisco subito
 * all'avvio se mancano, invece di scoprirlo a runtime nel primo controller che le usa.
 */
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET non definita: impostala nel file .env');
}

export { JWT_SECRET };
