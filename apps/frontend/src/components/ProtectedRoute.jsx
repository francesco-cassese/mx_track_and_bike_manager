import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Fa da guardia alle rotte private: se non c'è un utente autenticato,
 * reindirizza al login invece di renderizzare i figli.
 */
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
