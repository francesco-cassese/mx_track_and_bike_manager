// Centralizzo l'accesso al token: il resto dell'app (apiFetch, AuthContext)
// passa da qui invece di parlare direttamente con lo storage.
// Uso localStorage per "resta connesso" e sessionStorage per la sessione
// singola (checkbox "Ricordami" deselezionata), controllando entrambi in lettura.
const TOKEN_KEY = "authToken";

const getToken = () => localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);

const setToken = (token, remember = true) => {
    if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
        sessionStorage.removeItem(TOKEN_KEY);
    } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(TOKEN_KEY);
    }
};

const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
};

export { getToken, setToken, clearToken };
