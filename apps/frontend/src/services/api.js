const BASE_URL = 'http://localhost:3000';

/**
 * Eseguo una richiesta verso l'API e normalizzo la risposta.
 * Leggo sempre il body prima di controllare l'esito, così in caso di
 * errore posso propagare il messaggio mandato dal backend invece del
 * solo status HTTP.
 */
const apiFetch = async (endpoint, options = {}) => {

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

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

export { apiFetch }