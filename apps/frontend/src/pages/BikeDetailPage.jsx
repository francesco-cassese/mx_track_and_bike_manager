import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBike, deleteBike } from "../services/bikeApi";
import { getSessions, deleteSession } from "../services/sessionApi";
import { getMaintenances, deleteMaintenance } from "../services/maintenanceApi";
import { getRequestErrorMessage } from "../services/api";
import { getMaintenanceStatus, MAINTENANCE_STATUS_LABELS } from "../utils/maintenance";
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
 * Stessa logica di formattazione delle sessioni, ma tollerante a un valore
 * nullo perché service_date è un campo opzionale della manutenzione.
 */
const formatMaintenanceDate = (rawDate) => {
    if (!rawDate) return null;
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

    const [maintenances, setMaintenances] = useState([]);
    const [isMaintenancesLoading, setIsMaintenancesLoading] = useState(true);
    const [maintenancesError, setMaintenancesError] = useState("");
    const [confirmingDeleteMaintenanceId, setConfirmingDeleteMaintenanceId] = useState(null);
    const [deletingMaintenanceId, setDeletingMaintenanceId] = useState(null);
    const [maintenanceDeleteError, setMaintenanceDeleteError] = useState("");

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

    useEffect(() => {
        let isMounted = true;

        const loadMaintenances = async () => {
            try {
                const data = await getMaintenances(id);
                if (isMounted) setMaintenances(data);
            } catch (err) {
                if (isMounted) setMaintenancesError(getRequestErrorMessage(err));
            } finally {
                if (isMounted) setIsMaintenancesLoading(false);
            }
        };

        loadMaintenances();

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

    const handleConfirmDeleteMaintenance = async (maintenanceId) => {
        setDeletingMaintenanceId(maintenanceId);
        setMaintenanceDeleteError("");

        try {
            await deleteMaintenance(id, maintenanceId);
            setMaintenances((current) => current.filter((maintenance) => maintenance.id !== maintenanceId));
            setConfirmingDeleteMaintenanceId(null);
        } catch (err) {
            setMaintenanceDeleteError(getRequestErrorMessage(err));
        } finally {
            setDeletingMaintenanceId(null);
        }
    };

    return (
        <div className={`${styles.page} px-4 mx-auto`}>
            <Link to="/" className={styles.backLink}>&larr; Torna alla dashboard</Link>
            <div aria-live="polite">
                {error && <p className={`${styles.errorBanner} mb-4 px-3`}>{error}</p>}
            </div>
            {isLoading && <p>Caricamento moto in corso...</p>}
            {!isLoading && !error && bike && (
                <>
                    <h1>{bike.brand} {bike.model}</h1>
                    <dl className={styles.details}>
                        <dt>Anno</dt>
                        <dd className="mt-1 mb-4">{bike.year}</dd>
                        <dt>Ore totali</dt>
                        <dd className="mt-1 mb-4">{bike.totalHours}</dd>
                    </dl>
                    <div className={`${styles.actions} gap-3 mb-4`}>
                        <Link to={`/bikes/${bike.id}/history`} className={`${styles.editButton} px-4`}>Grafico storico ore</Link>
                    </div>
                    <div aria-live="polite">
                        {deleteError && <p className={`${styles.errorBanner} mb-4 px-3`}>{deleteError}</p>}
                    </div>
                    {!isConfirmingDelete && (
                        <div className={`${styles.actions} gap-3`}>
                            <Link to={`/bikes/${bike.id}/edit`} className={`${styles.editButton} px-4`}>Modifica</Link>
                            <button type="button" className={`${styles.deleteButton} px-4`} onClick={() => setIsConfirmingDelete(true)}>Elimina</button>
                        </div>
                    )}
                    {isConfirmingDelete && (
                        <div className={`${styles.confirmDelete} mt-4 p-4`}>
                            <p className="mb-3">Eliminare questa moto? L'azione non è reversibile.</p>
                            <div className={`${styles.actions} gap-3`}>
                                <button type="button" className={`${styles.deleteButton} px-4`} onClick={handleConfirmDelete} disabled={isDeleting}>
                                    {isDeleting ? "Eliminazione in corso..." : "Conferma eliminazione"}
                                </button>
                                <button type="button" onClick={() => setIsConfirmingDelete(false)} disabled={isDeleting}>Annulla</button>
                            </div>
                        </div>
                    )}

                    <div className={`${styles.sessionsHeader} gap-3 mt-5 mb-4 pb-3`}>
                        <h2>Allenamenti</h2>
                        <Link to={`/bikes/${bike.id}/sessions/new`} className={`${styles.editButton} px-4`}>Aggiungi allenamento</Link>
                    </div>
                    <div aria-live="polite">
                        {sessionsError && <p className={`${styles.errorBanner} mb-4 px-3`}>{sessionsError}</p>}
                        {sessionDeleteError && <p className={`${styles.errorBanner} mb-4 px-3`}>{sessionDeleteError}</p>}
                    </div>
                    {isSessionsLoading && <p>Caricamento allenamenti in corso...</p>}
                    {!isSessionsLoading && !sessionsError && sessions.length === 0 && (
                        <p>Nessun allenamento registrato per questa moto.</p>
                    )}
                    {!isSessionsLoading && !sessionsError && sessions.length > 0 && (
                        <ul className={`${styles.sessionsList} gap-3`}>
                            {sessions.map((session) => (
                                <li key={session.id} className={`${styles.sessionItem} gap-3 p-4`}>
                                    <div className={`${styles.sessionInfo} gap-1`}>
                                        <strong className={styles.sessionTrack}>
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M12 21s-7-6.5-7-11.5A7 7 0 0 1 19 9.5C19 14.5 12 21 12 21Z" />
                                                <circle cx="12" cy="9.5" r="2.5" />
                                            </svg>
                                            {session.track}
                                        </strong>
                                        <span className={styles.sessionMeta}>
                                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                                <path d="M16 2v4M8 2v4M3 10h18" />
                                            </svg>
                                            {formatSessionDate(session.date)}
                                        </span>
                                        {session.hours_logged != null && (
                                            <span className={styles.sessionMeta}>
                                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <circle cx="12" cy="12" r="9" />
                                                    <path d="M12 7v5l3 3" />
                                                </svg>
                                                {session.hours_logged} h
                                            </span>
                                        )}
                                        {session.feeling != null && <span className={styles.sessionMeta}>Sensazioni: {session.feeling}/5</span>}
                                    </div>
                                    {confirmingDeleteSessionId !== session.id && (
                                        <div className={`${styles.actions} gap-3`}>
                                            <Link to={`/bikes/${bike.id}/sessions/${session.id}/edit`} className={`${styles.editButton} px-4`}>Modifica</Link>
                                            <button type="button" className={`${styles.deleteButton} px-4`} onClick={() => setConfirmingDeleteSessionId(session.id)}>Elimina</button>
                                        </div>
                                    )}
                                    {confirmingDeleteSessionId === session.id && (
                                        <div className={`${styles.confirmDelete} mt-4 p-4`}>
                                            <p className="mb-3">Eliminare questo allenamento? L'azione non è reversibile.</p>
                                            <div className={`${styles.actions} gap-3`}>
                                                <button
                                                    type="button"
                                                    className={`${styles.deleteButton} px-4`}
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

                    <div className={`${styles.sessionsHeader} gap-3 mt-5 mb-4 pb-3`}>
                        <h2>Manutenzioni</h2>
                        <Link to={`/bikes/${bike.id}/maintenance/new`} className={`${styles.editButton} px-4`}>Aggiungi manutenzione</Link>
                    </div>
                    <div aria-live="polite">
                        {maintenancesError && <p className={`${styles.errorBanner} mb-4 px-3`}>{maintenancesError}</p>}
                        {maintenanceDeleteError && <p className={`${styles.errorBanner} mb-4 px-3`}>{maintenanceDeleteError}</p>}
                    </div>
                    {isMaintenancesLoading && <p>Caricamento manutenzioni in corso...</p>}
                    {!isMaintenancesLoading && !maintenancesError && maintenances.length === 0 && (
                        <p>Nessuna scadenza di manutenzione registrata per questa moto.</p>
                    )}
                    {!isMaintenancesLoading && !maintenancesError && maintenances.length > 0 && (
                        <ul className={`${styles.sessionsList} gap-3`}>
                            {maintenances.map((maintenance) => {
                                const status = getMaintenanceStatus(maintenance.hour_threshold, bike.totalHours, maintenance.last_service_hours);
                                const formattedDate = formatMaintenanceDate(maintenance.service_date);

                                return (
                                    <li key={maintenance.id} className={`${styles.sessionItem} gap-3 p-4`}>
                                        <div className={`${styles.sessionInfo} gap-1`}>
                                            <strong className={styles.sessionTrack}>
                                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
                                                </svg>
                                                {maintenance.task_description}
                                            </strong>
                                            {formattedDate && (
                                                <span className={styles.sessionMeta}>
                                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                                        <path d="M16 2v4M8 2v4M3 10h18" />
                                                    </svg>
                                                    {formattedDate}
                                                </span>
                                            )}
                                            {maintenance.hour_threshold != null && (
                                                <span className={styles.sessionMeta}>
                                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                        <circle cx="12" cy="12" r="9" />
                                                        <path d="M12 7v5l3 3" />
                                                    </svg>
                                                    Ogni {maintenance.hour_threshold} h
                                                </span>
                                            )}
                                            <span className={`${styles.statusBadge} ${status ? styles[status] : styles.unknown} py-1`}>
                                                {status ? MAINTENANCE_STATUS_LABELS[status] : "N/D"}
                                            </span>
                                        </div>
                                        {confirmingDeleteMaintenanceId !== maintenance.id && (
                                            <div className={`${styles.actions} gap-3`}>
                                                <Link to={`/bikes/${bike.id}/maintenance/${maintenance.id}/edit`} className={`${styles.editButton} px-4`}>Modifica</Link>
                                                <button type="button" className={`${styles.deleteButton} px-4`} onClick={() => setConfirmingDeleteMaintenanceId(maintenance.id)}>Elimina</button>
                                            </div>
                                        )}
                                        {confirmingDeleteMaintenanceId === maintenance.id && (
                                            <div className={`${styles.confirmDelete} mt-4 p-4`}>
                                                <p className="mb-3">Eliminare questa scadenza di manutenzione? L'azione non è reversibile.</p>
                                                <div className={`${styles.actions} gap-3`}>
                                                    <button
                                                        type="button"
                                                        className={`${styles.deleteButton} px-4`}
                                                        onClick={() => handleConfirmDeleteMaintenance(maintenance.id)}
                                                        disabled={deletingMaintenanceId === maintenance.id}
                                                    >
                                                        {deletingMaintenanceId === maintenance.id ? "Eliminazione in corso..." : "Conferma eliminazione"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmingDeleteMaintenanceId(null)}
                                                        disabled={deletingMaintenanceId === maintenance.id}
                                                    >
                                                        Annulla
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </>
            )}
        </div>
    )
}
export default BikeDetailPage
