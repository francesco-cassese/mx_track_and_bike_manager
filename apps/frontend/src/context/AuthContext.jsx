import { createContext, useState, useCallback } from "react";
import { getToken, setToken as persistToken, clearToken } from "../services/tokenStorage";

const AuthContext = createContext(null);

/**
 * Espongo lo stato di autenticazione (token + derivati) a tutta l'app.
 * Inizializzo da localStorage così una pagina ricaricata resta loggata.
 */
function AuthProvider({ children }) {
    const [token, setToken] = useState(() => getToken());

    const login = useCallback((newToken) => {
        persistToken(newToken);
        setToken(newToken);
    }, []);

    const logout = useCallback(() => {
        clearToken();
        setToken(null);
    }, []);

    const value = { token, isAuthenticated: Boolean(token), login, logout };

    return <AuthContext value={value}>{children}</AuthContext>;
}

export { AuthContext, AuthProvider };
