import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Espongo lo stato di autenticazione ai componenti. Separato da AuthContext.jsx
 * perché react-refresh non ammette che un file esporti sia componenti che hook.
 */
const useAuth = () => {
    const context = useContext(AuthContext);

    // Il context di default è null: se arrivo qui è perché manca l'AuthProvider a monte
    if (!context) {
        throw new Error("useAuth deve essere usato dentro un AuthProvider");
    }

    return context;
};

export { useAuth };
