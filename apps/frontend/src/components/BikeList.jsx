import BikeCard from "./BikeCard";
import styles from "./BikeList.module.css";

/**
 * Contenitore dell'elenco moto: incapsula qui lo stato vuoto così
 * HomePage deve solo distinguere loading/error dal resto.
 */
function BikeList({ bikes }) {
    if (bikes.length === 0) {
        return <p className={styles.emptyState}>Nessuna moto registrata</p>;
    }

    return (
        <ul className={styles.grid}>
            {bikes.map((bike) => (
                <li key={bike.id}>
                    <BikeCard bike={bike} />
                </li>
            ))}
        </ul>
    )
}
export default BikeList
