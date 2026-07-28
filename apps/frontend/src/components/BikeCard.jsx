import { Link } from "react-router-dom";
import { getBikeImage } from "../utils/bikeImages";
import styles from "./BikeCard.module.css";

/**
 * Determino l'etichetta/stile del badge dal peggiore stato tra gli alert:
 * "scaduta" ha priorità su "in_scadenza" se coesistono più manutenzioni.
 */
const getWorstAlert = (alerts) => {
    if (alerts.some((a) => a.status === 'scaduta')) {
        return { label: 'Manutenzione scaduta', className: styles.overdue };
    }
    if (alerts.some((a) => a.status === 'in_scadenza')) {
        return { label: 'Manutenzione in scadenza', className: styles.due };
    }
    return null;
};

/**
 * Presentazione di una singola moto: dati base (marca, modello, anno),
 * ore totali di utilizzo e un badge se ci sono manutenzioni in scadenza/scadute.
 */
function BikeCard({ bike }) {
    const worstAlert = getWorstAlert(bike.alerts ?? []);
    const imageSrc = getBikeImage(bike);

    return (
        <Link to={`/bikes/${bike.id}`} className={`${styles.card} p-4`}>
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
            <h2 className="mb-2">{bike.brand} {bike.model}</h2>
            <p>{bike.year}</p>
            <p>Ore totali: {bike.totalHours}</p>
            {worstAlert && (
                <span className={`${styles.badge} ${worstAlert.className} mt-3 py-1`}>{worstAlert.label}</span>
            )}
        </Link>
    )
}
export default BikeCard
