import { useParams, useNavigate } from "react-router-dom";
import SessionForm from "../components/SessionForm";
import { createSession } from "../services/sessionApi";
import styles from "./AddSessionPage.module.css";

/**
 * Pagina di creazione sessione (allenamento) per una moto: il vero
 * submit/errore è gestito da SessionForm, qui mi limito a chiamare l'API e
 * a decidere dove andare dopo il successo.
 */
function AddSessionPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        await createSession(id, values);
        navigate(`/bikes/${id}`);
    };

    return (
        <div className={styles.page}>
            <h1>Aggiungi allenamento</h1>
            <SessionForm
                initialValues={{ date: "", track: "", weather: "", feeling: "", hoursLogged: "", notes: "" }}
                onSubmit={handleSubmit}
                submitLabel="Aggiungi allenamento"
                cancelHref={`/bikes/${id}`}
            />
        </div>
    )
}
export default AddSessionPage
