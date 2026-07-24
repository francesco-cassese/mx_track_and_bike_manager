import { useAuth } from "../hooks/useAuth";
import HomePage from "../pages/HomePage";
import LandingPage from "../pages/LandingPage";

/**
 * La radice "/" non è una rotta protetta in senso stretto: mostra la
 * dashboard se l'utente è già autenticato, altrimenti la landing page
 * pubblica con gli accessi a login/registrazione.
 */
function RootRoute() {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <HomePage /> : <LandingPage />;
}

export default RootRoute;
