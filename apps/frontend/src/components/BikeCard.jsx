import { Link } from "react-router-dom";
import { getBikeImage } from "../utils/bikeImages";
import styles from "./BikeCard.module.css";

const STATUS_LABELS = {
    active: "Attiva",
    ready: "Pronta",
    maintenance: "Manutenzione",
};

/**
 * Scelgo la manutenzione più urgente da mostrare nella barra: "scaduta" ha
 * priorità su "in_scadenza" se coesistono più manutenzioni.
 */
const getWorstAlert = (alerts) => {
    return alerts.find((a) => a.status === 'scaduta') ?? alerts.find((a) => a.status === 'in_scadenza') ?? null;
};

/**
 * Percentuale di riempimento della barra manutenzione: 0 = intervento appena
 * fatto, 100 = soglia raggiunta/superata.
 */
const getAlertProgress = (alert) => {
    if (!alert?.hour_threshold) return 0;
    const usedFraction = 1 - alert.remaining_hours / alert.hour_threshold;
    return Math.min(100, Math.max(0, usedFraction * 100));
};

/**
 * Presentazione di una singola moto: dati base, stato operativo, ore totali,
 * barra della manutenzione più urgente e azioni rapide (modifica/dettaglio/log).
 */
function BikeCard({ bike }) {
    const alerts = bike.alerts ?? [];
    const worstAlert = getWorstAlert(alerts);
    const imageSrc = getBikeImage(bike);
    const status = bike.status ?? 'active';
    const progress = getAlertProgress(worstAlert);
    const barClassName = worstAlert?.status === 'scaduta' ? styles.barOverdue : worstAlert?.status === 'in_scadenza' ? styles.barDue : styles.barOk;

    return (
        <article className={`${styles.card} p-4`}>
            <Link to={`/bikes/${bike.id}`} className={styles.mainLink}>
                {imageSrc ? (
                    <img className={styles.image} src={imageSrc} alt={`${bike.brand} ${bike.model}`} />
                ) : (
                    <svg className={styles.icon} viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="5.5" cy="17.5" r="3.5" />
                        <circle cx="18.5" cy="17.5" r="3.5" />
                        <path d="M5.5 17.5 9 10h5l3.5 7.5" />
                        <path d="M9 10 7.5 6h-2" />
                        <path d="M12 10l2-3h2.5" />
                    </svg>
                )}

                <div className={`${styles.headerRow} mb-2`}>
                    <h2>{bike.brand} {bike.model}</h2>
                    <span className={styles.bikeId}>#{String(bike.id).padStart(2, '0')}</span>
                </div>

                <p>VIN: {bike.vin || '—'}</p>
                <p className="mb-3">Anno: {bike.year}</p>

                <span className={`${styles.statusBadge} ${styles[status] ?? ''}`}>{STATUS_LABELS[status] ?? status}</span>

                <div className={`${styles.hours} mt-3`}>
                    <p className={styles.hoursLabel}>Ore totali</p>
                    <p className={styles.hoursValue}>{bike.totalHours}h</p>
                </div>

                <div className={`${styles.alertBlock} mt-3`}>
                    <div className={styles.alertRow}>
                        <p className={styles.alertLabel}>Allerta manutenzione</p>
                        {worstAlert && (
                            <span className={worstAlert.status === 'scaduta' ? styles.overdueText : styles.dueText}>
                                {worstAlert.task_description}: {worstAlert.status === 'scaduta'
                                    ? `scaduto da ${Math.abs(worstAlert.remaining_hours).toFixed(1)}h`
                                    : `tra ${worstAlert.remaining_hours.toFixed(1)}h`}
                            </span>
                        )}
                    </div>
                    <div className={styles.progressTrack}>
                        <div className={`${styles.progressFill} ${barClassName}`} style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </Link>

            <div className={`${styles.actions} mt-3 pt-3`}>
                <Link to={`/bikes/${bike.id}/edit`} className={styles.actionButton}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                    Modifica
                </Link>
                <Link to={`/bikes/${bike.id}`} className={styles.actionButton}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    Vedi
                </Link>
                <Link to={`/bikes/${bike.id}/history`} className={styles.actionButton}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                        <path d="M14 2v6h6" />
                        <path d="M9 13h6" />
                        <path d="M9 17h6" />
                    </svg>
                    Log
                </Link>
            </div>
        </article>
    )
}
export default BikeCard
