import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SessionForm from "../components/SessionForm";
import { getSessions, updateSession } from "../services/sessionApi";
import { getRequestErrorMessage } from "../services/api";
import styles from "./EditSessionPage.module.css";

/**
 * Estraggo solo la parte data (aaaa-mm-gg) dalla stringa ISO restituita dal
 * backend, così <input type="date"> la accetta senza conversioni di fuso
 * orario che potrebbero spostare il giorno.
 */
const toDateInputValue = (rawDate) => String(rawDate).slice(0, 10);

/**
 * Pagina di modifica sessione (allenamento): l'API non espone un GET
 * singolo per sessione, quindi recupero la lista della moto e filtro per
 * id, poi delego a onSubmit la vera PUT e la navigazione al successo.
 */
function EditSessionPage() {
    const { id, sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        getSessions(id)
            .then((data) => {
                if (!isMounted) return;

                const found = data.find((item) => String(item.id) === sessionId);
                if (!found) {
                    setError("Allenamento non trovato");
                    return;
                }
                setSession(found);
            })
            .catch((err) => {
                if (isMounted) setError(getRequestErrorMessage(err));
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, [id, sessionId]);

    const handleSubmit = async (values) => {
        await updateSession(id, sessionId, values);
        navigate(`/bikes/${id}`);
    };

    return (
        <div className={styles.page}>
            <h1>Modifica allenamento</h1>
            <div aria-live="polite">
                {error && <p className={styles.errorBanner}>{error}</p>}
            </div>
            {isLoading && <p>Caricamento allenamento in corso...</p>}
            {!isLoading && !error && session && (
                <SessionForm
                    initialValues={{
                        date: toDateInputValue(session.date),
                        track: session.track,
                        weather: session.weather ?? "",
                        feeling: session.feeling ?? "",
                        hoursLogged: session.hours_logged ?? "",
                        notes: session.notes ?? ""
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="Salva modifiche"
                    cancelHref={`/bikes/${id}`}
                />
            )}
        </div>
    )
}
export default EditSessionPage
