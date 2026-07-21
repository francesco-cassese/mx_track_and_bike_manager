import { useNavigate } from "react-router-dom";
import BikeForm from "../components/BikeForm";
import { createBike } from "../services/bikeApi";
import styles from "./AddBikePage.module.css";

/**
 * Pagina di creazione moto: il vero submit/errore è gestito da BikeForm,
 * qui mi limito a chiamare l'API e a decidere dove andare dopo il successo.
 */
function AddBikePage() {
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const newBike = await createBike(values);
        navigate(`/bikes/${newBike.id}`);
    };

    return (
        <div className={styles.page}>
            <h1>Aggiungi moto</h1>
            <BikeForm
                initialValues={{ brand: "", model: "", year: "" }}
                onSubmit={handleSubmit}
                submitLabel="Aggiungi moto"
                cancelHref="/"
            />
        </div>
    )
}
export default AddBikePage
