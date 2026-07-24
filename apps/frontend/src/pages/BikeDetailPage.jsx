import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBike, deleteBike } from "../services/bikeApi";
import { getSessions, deleteSession } from "../services/sessionApi";
import { getRequestErrorMessage } from "../services/api";
import styles from "./BikeDetailPage.module.css";

/**
 * Formatto la data di una sessione in gg/mm/aaaa lavorando sulla stringa
 * ISO grezza (senza passare da un oggetto Date), per evitare che la
 * conversione UTC/fuso orario sposti il giorno visualizzato.
 */
const formatSessionDate = (rawDate) => {
    const [year, month, day] = String(rawDate).slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
};

/**
 * Dettaglio di una singola moto: GET /bike/:id restituisce già le ore
 * totali insieme ai dati base, quindi basta una sola chiamata.
 */
function BikeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bike, setBike] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const [sessions, setSessions] = useState([]);
    const [isSessionsLoading, setIsSessionsLoading] = useState(true);
    const [sessionsError, setSessionsError] = useState("");
    const [confirmingDeleteSessionId, setConfirmingDeleteSessionId] = useState(null);
    const [deletingSessionId, setDeletingSessionId] = useState(null);
    const [sessionDeleteError, setSessionDeleteError] = useState("");

    useEffect(() => {
        let isMounted = true;

        getBike(id)
            .then((data) => {
                if (isMounted) setBike(data);
            })
            .catch((err) => {
                if (isMounted) setError(getRequestErrorMessage(err));
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, [id]);

    useEffect(() => {
        let isMounted = true;

        getSessions(id)
            .then((data) => {
                if (isMounted) setSessions(data);
            })
            .catch((err) => {
                if (isMounted) setSessionsError(getRequestErrorMessage(err));
            })
            .finally(() => {
                if (isMounted) setIsSessionsLoading(false);
            });

        return () => { isMounted = false; };
    }, [id]);

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        setDeleteError("");

        try {
            await deleteBike(id);
            navigate("/");
        } catch (err) {
            setDeleteError(getRequestErrorMessage(err));
            setIsDeleting(false);
        }
    };

    const handleConfirmDeleteSession = async (sessionId) => {
        setDeletingSessionId(sessionId);
        setSessionDeleteError("");

        try {
            await deleteSession(id, sessionId);
            setSessions((current) => current.filter((session) => session.id !== sessionId));
            setConfirmingDeleteSessionId(null);
        } catch (err) {
            setSessionDeleteError(getRequestErrorMessage(err));
        } finally {
            setDeletingSessionId(null);
        }
    };

    return (
        <div className={styles.page}>
            <Link to="/" className={styles.backLink}>&larr; Torna alla dashboard</Link>
            <div aria-live="polite">
                {error && <p className={styles.errorBanner}>{error}</p>}
            </div>
            {isLoading && <p>Caricamento moto in corso...</p>}
            {!isLoading && !error && bike && (
                <>
                    <h1>{bike.brand} {bike.model}</h1>
                    <dl className={styles.details}>
                        <dt>Anno</dt>
                        <dd>{bike.year}</dd>
                        <dt>Ore totali</dt>
                        <dd>{bike.totalHours}</dd>
                    </dl>
                    <div aria-live="polite">
                        {deleteError && <p className={styles.errorBanner}>{deleteError}</p>}
                    </div>
                    {!isConfirmingDelete && (
                        <div className={styles.actions}>
                            <Link to={`/bikes/${bike.id}/edit`} className={styles.editButton}>Modifica</Link>
                            <button type="button" className={styles.deleteButton} onClick={() => setIsConfirmingDelete(true)}>Elimina</button>
                        </div>
                    )}
                    {isConfirmingDelete && (
                        <div className={styles.confirmDelete}>
                            <p>Eliminare questa moto? L'azione non è reversibile.</p>
                            <div className={styles.actions}>
                                <button type="button" className={styles.deleteButton} onClick={handleConfirmDelete} disabled={isDeleting}>
                                    {isDeleting ? "Eliminazione in corso..." : "Conferma eliminazione"}
                                </button>
                                <button type="button" onClick={() => setIsConfirmingDelete(false)} disabled={isDeleting}>Annulla</button>
                            </div>
                        </div>
                    )}

                    <div className={styles.sessionsHeader}>
                        <h2>Allenamenti</h2>
                        <Link to={`/bikes/${bike.id}/sessions/new`} className={styles.editButton}>Aggiungi allenamento</Link>
                    </div>
                    <div aria-live="polite">
                        {sessionsError && <p className={styles.errorBanner}>{sessionsError}</p>}
                        {sessionDeleteError && <p className={styles.errorBanner}>{sessionDeleteError}</p>}
                    </div>
                    {isSessionsLoading && <p>Caricamento allenamenti in corso...</p>}
                    {!isSessionsLoading && !sessionsError && sessions.length === 0 && (
                        <p>Nessun allenamento registrato per questa moto.</p>
                    )}
                    {!isSessionsLoading && !sessionsError && sessions.length > 0 && (
                        <ul className={styles.sessionsList}>
                            {sessions.map((session) => (
                                <li key={session.id} className={styles.sessionItem}>
                                    <div className={styles.sessionInfo}>
                                        <strong>{session.track}</strong>
                                        <span>{formatSessionDate(session.date)}</span>
                                        {session.hours_logged != null && <span>{session.hours_logged} h</span>}
                                        {session.feeling != null && <span>Sensazioni: {session.feeling}/5</span>}
                                    </div>
                                    {confirmingDeleteSessionId !== session.id && (
                                        <div className={styles.actions}>
                                            <Link to={`/bikes/${bike.id}/sessions/${session.id}/edit`} className={styles.editButton}>Modifica</Link>
                                            <button type="button" className={styles.deleteButton} onClick={() => setConfirmingDeleteSessionId(session.id)}>Elimina</button>
                                        </div>
                                    )}
                                    {confirmingDeleteSessionId === session.id && (
                                        <div className={styles.confirmDelete}>
                                            <p>Eliminare questo allenamento? L'azione non è reversibile.</p>
                                            <div className={styles.actions}>
                                                <button
                                                    type="button"
                                                    className={styles.deleteButton}
                                                    onClick={() => handleConfirmDeleteSession(session.id)}
                                                    disabled={deletingSessionId === session.id}
                                                >
                                                    {deletingSessionId === session.id ? "Eliminazione in corso..." : "Conferma eliminazione"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmingDeleteSessionId(null)}
                                                    disabled={deletingSessionId === session.id}
                                                >
                                                    Annulla
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    )
}
export default BikeDetailPage
