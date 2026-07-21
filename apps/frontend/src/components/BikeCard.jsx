import { Link } from "react-router-dom";
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

    return (
        <Link to={`/bikes/${bike.id}`} className={styles.card}>
            <h2>{bike.brand} {bike.model}</h2>
            <p>{bike.year}</p>
            <p>Ore totali: {bike.totalHours}</p>
            {worstAlert && (
                <span className={`${styles.badge} ${worstAlert.className}`}>{worstAlert.label}</span>
            )}
        </Link>
    )
}
export default BikeCard
