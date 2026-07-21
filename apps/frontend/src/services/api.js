import { getToken } from "./tokenStorage";

const BASE_URL = 'http://localhost:3000';

/**
 * Eseguo una richiesta verso l'API e normalizzo la risposta.
 * Leggo sempre il body prima di controllare l'esito, così in caso di
 * errore posso propagare il messaggio mandato dal backend invece del
 * solo status HTTP.
 */
const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();

    // Allego il token, se presente, senza obbligare ogni chiamante a
    // preoccuparsene: le richieste su rotte pubbliche (es. login) semplicemente non ne hanno
    const headers = {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

    const result = await response.json();

    // Il backend risponde sempre con { success, message? }, anche sugli errori:
    // se la richiesta fallisce o success è false, rilancio il messaggio reale.
    // Allego anche lo status HTTP: serve ai chiamanti che devono distinguere
    // il tipo di errore (es. 409 su email duplicata) invece di trattarlo come generico.
    if (!response.ok || !result.success) {
        const error = new Error(result.message || `Errore HTTP: ${response.status}`);
        error.status = response.status;
        throw error;
    }

    return result.data;

}

/**
 * Scorciatoia per le POST con body JSON: evita di ripetere headers e
 * JSON.stringify in ogni chiamante (es. i vari metodi di authApi).
 */
const postJson = (endpoint, body) => apiFetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
});

const OFFLINE_ERROR_MESSAGE = "Impossibile contattare il server. Controlla la connessione.";

/**
 * Ricava il messaggio da mostrare per un errore lanciato da apiFetch:
 * se ha uno status il messaggio arriva dal backend, altrimenti la richiesta
 * non ha nemmeno raggiunto il server (es. rete offline).
 */
const getRequestErrorMessage = (error) => (error.status ? error.message : OFFLINE_ERROR_MESSAGE);

export { apiFetch, postJson, getRequestErrorMessage }