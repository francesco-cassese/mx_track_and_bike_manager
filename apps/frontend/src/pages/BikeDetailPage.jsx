import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBike, deleteBike } from "../services/bikeApi";
import { getRequestErrorMessage } from "../services/api";
import styles from "./BikeDetailPage.module.css";

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
                </>
            )}
        </div>
    )
}
export default BikeDetailPage
