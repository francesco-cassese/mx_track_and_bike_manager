import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getBikes } from "../services/bikeApi";
import { getRequestErrorMessage } from "../services/api";
import BikeList from "../components/BikeList";
import styles from "./HomePage.module.css";

/**
 * Dashboard: al mount recupero le moto dell'utente loggato (GET /bike
 * restituisce già ore totali e alert manutenzione calcolati lato server),
 * gestendo esplicitamente i tre stati (caricamento, errore, lista vuota).
 */
function HomePage() {
    const { logout } = useAuth();
    const [bikes, setBikes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        getBikes()
            .then((data) => {
                if (isMounted) setBikes(data);
            })
            .catch((err) => {
                if (isMounted) setError(getRequestErrorMessage(err));
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        // Evito di aggiornare lo stato se il componente viene smontato prima
        // che la richiesta risponda (es. logout durante il fetch)
        return () => { isMounted = false; };
    }, []);

    return (
        <div className={styles.page}>
            <div className={`${styles.header} gap-3 pb-3`}>
                <h1>Dashboard</h1>
                <div className={`${styles.headerActions} gap-3`}>
                    <Link to="/bikes/new" className={styles.addButton}>Aggiungi moto</Link>
                    <button type="button" className={styles.logoutButton} onClick={logout}>Esci</button>
                </div>
            </div>
            <div aria-live="polite">
                {error && <p className={`${styles.errorBanner} mb-4 px-3`}>{error}</p>}
            </div>
            {isLoading && (
                <div className={`${styles.loadingState} py-5`}>
                    <span className={styles.spinner} aria-hidden="true" />
                    <span>Caricamento moto in corso...</span>
                </div>
            )}
            {!isLoading && !error && <BikeList bikes={bikes} />}
        </div>
    )
}
export default HomePage
