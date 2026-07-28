import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBike } from "../services/bikeApi";
import { getSessions } from "../services/sessionApi";
import { getRequestErrorMessage } from "../services/api";
import HoursHistoryChart from "../components/HoursHistoryChart";
import styles from "./BikeHistoryPage.module.css";

/**
 * Dal totale sessioni costruisco la serie storica delle ore cumulate: tengo
 * solo le sessioni con ore registrate (le altre non contribuiscono alla
 * somma, stessa logica di SUM(hours_logged) lato backend), ordino per data
 * e sommo progressivamente.
 */
const buildCumulativeHistory = (sessions) => {
    const sorted = sessions
        .filter((session) => session.hours_logged != null)
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date));

    let runningTotal = 0;
    return sorted.map((session) => {
        runningTotal += Number(session.hours_logged);
        return { date: session.date, cumulativeHours: Math.round(runningTotal * 100) / 100 };
    });
};

/**
 * Pagina storico ore di una moto: mostra l'andamento cumulativo delle ore
 * registrate sessione dopo sessione.
 */
function BikeHistoryPage() {
    const { id } = useParams();
    const [bike, setBike] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const [bikeData, sessionsData] = await Promise.all([getBike(id), getSessions(id)]);
                if (isMounted) {
                    setBike(bikeData);
                    setSessions(sessionsData);
                }
            } catch (err) {
                if (isMounted) setError(getRequestErrorMessage(err));
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadData();

        return () => { isMounted = false; };
    }, [id]);

    const history = useMemo(() => buildCumulativeHistory(sessions), [sessions]);

    return (
        <div className={`${styles.page} px-4 mx-auto`}>
            <Link to={`/bikes/${id}`} className={styles.backLink}>&larr; Torna alla moto</Link>
            <div aria-live="polite">
                {error && <p className={`${styles.errorBanner} mb-4 px-3`}>{error}</p>}
            </div>
            {isLoading && <p>Caricamento storico in corso...</p>}
            {!isLoading && !error && bike && (
                <>
                    <h1>Storico ore &mdash; {bike.brand} {bike.model}</h1>
                    {history.length === 0 && (
                        <p className="mt-4">Nessun dato sufficiente per generare il grafico.</p>
                    )}
                    {history.length > 0 && (
                        <div className="mt-4">
                            <HoursHistoryChart data={history} />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default BikeHistoryPage
