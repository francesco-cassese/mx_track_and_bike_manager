// Centralizzo l'accesso al token in localStorage: il resto dell'app
// (apiFetch, AuthContext) passa da qui invece di parlare direttamente con lo storage.
const TOKEN_KEY = "authToken";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export { getToken, setToken, clearToken };
