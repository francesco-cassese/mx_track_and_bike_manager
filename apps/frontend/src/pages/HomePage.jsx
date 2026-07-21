import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getBikes, getBikeTotalHours, getBikeAlerts } from "../services/bikeApi";
import { getRequestErrorMessage } from "../services/api";
import BikeList from "../components/BikeList";
import styles from "./HomePage.module.css";

/**
 * Per ogni moto recupero ore totali e alert manutenzione in parallelo,
 * così le richieste di tutte le moto viaggiano insieme invece che in serie.
 */
const enrichBike = async (bike) => {
    const [{ totalHours }, alerts] = await Promise.all([
        getBikeTotalHours(bike.id),
        getBikeAlerts(bike.id),
    ]);
    return { ...bike, totalHours, alerts };
};

/**
 * Dashboard: al mount recupero le moto dell'utente loggato, le arricchisco
 * con ore totali e alert manutenzione, gestendo esplicitamente i tre stati
 * (caricamento, errore, lista vuota).
 */
function HomePage() {
    const { logout } = useAuth();
    const [bikes, setBikes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadBikes() {
            try {
                const data = await getBikes();
                const enrichedBikes = await Promise.all(data.map(enrichBike));
                if (isMounted) setBikes(enrichedBikes);
            } catch (err) {
                if (isMounted) setError(getRequestErrorMessage(err));
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadBikes();

        // Evito di aggiornare lo stato se il componente viene smontato prima
        // che la richiesta risponda (es. logout durante il fetch)
        return () => { isMounted = false; };
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Dashboard</h1>
                <div className={styles.headerActions}>
                    <Link to="/bikes/new" className={styles.addButton}>Aggiungi moto</Link>
                    <button type="button" className={styles.logoutButton} onClick={logout}>Esci</button>
                </div>
            </div>
            <div aria-live="polite">
                {error && <p className={styles.errorBanner}>{error}</p>}
            </div>
            {isLoading && (
                <div className={styles.loadingState}>
                    <span className={styles.spinner} aria-hidden="true" />
                    <span>Caricamento moto in corso...</span>
                </div>
            )}
            {!isLoading && !error && <BikeList bikes={bikes} />}
        </div>
    )
}
export default HomePage
