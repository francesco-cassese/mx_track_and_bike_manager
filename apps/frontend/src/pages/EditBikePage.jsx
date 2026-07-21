import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BikeForm from "../components/BikeForm";
import { getBike, updateBike } from "../services/bikeApi";
import { getRequestErrorMessage } from "../services/api";
import styles from "./EditBikePage.module.css";

/**
 * Pagina di modifica moto: recupero prima i dati esistenti per precompilare
 * BikeForm, poi delego a onSubmit la vera PUT e la navigazione al successo.
 */
function EditBikePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bike, setBike] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

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

    const handleSubmit = async (values) => {
        await updateBike(id, values);
        navigate(`/bikes/${id}`);
    };

    return (
        <div className={styles.page}>
            <h1>Modifica moto</h1>
            <div aria-live="polite">
                {error && <p className={styles.errorBanner}>{error}</p>}
            </div>
            {isLoading && <p>Caricamento moto in corso...</p>}
            {!isLoading && !error && bike && (
                <BikeForm
                    initialValues={{ brand: bike.brand, model: bike.model, year: bike.year }}
                    onSubmit={handleSubmit}
                    submitLabel="Salva modifiche"
                    cancelHref={`/bikes/${id}`}
                />
            )}
        </div>
    )
}
export default EditBikePage
