import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MaintenanceForm from "../components/MaintenanceForm";
import { getMaintenances, updateMaintenance } from "../services/maintenanceApi";
import { getRequestErrorMessage } from "../services/api";
import styles from "./EditMaintenancePage.module.css";

/**
 * Estraggo solo la parte data (aaaa-mm-gg) dalla stringa ISO restituita dal
 * backend, così <input type="date"> la accetta senza conversioni di fuso
 * orario che potrebbero spostare il giorno.
 */
const toDateInputValue = (rawDate) => (rawDate ? String(rawDate).slice(0, 10) : "");

/**
 * Pagina di modifica scadenza di manutenzione: l'API non espone un GET
 * singolo per manutenzione, quindi recupero la lista della moto e filtro
 * per id, poi delego a onSubmit la vera PUT e la navigazione al successo.
 */
function EditMaintenancePage() {
    const { id, maintenanceId } = useParams();
    const navigate = useNavigate();
    const [maintenance, setMaintenance] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        getMaintenances(id)
            .then((data) => {
                if (!isMounted) return;

                const found = data.find((item) => String(item.id) === maintenanceId);
                if (!found) {
                    setError("Scadenza di manutenzione non trovata");
                    return;
                }
                setMaintenance(found);
            })
            .catch((err) => {
                if (isMounted) setError(getRequestErrorMessage(err));
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, [id, maintenanceId]);

    const handleSubmit = async (values) => {
        await updateMaintenance(id, maintenanceId, values);
        navigate(`/bikes/${id}`);
    };

    return (
        <div className={styles.page}>
            <h1>Modifica manutenzione</h1>
            <div aria-live="polite">
                {error && <p className={styles.errorBanner}>{error}</p>}
            </div>
            {isLoading && <p>Caricamento manutenzione in corso...</p>}
            {!isLoading && !error && maintenance && (
                <MaintenanceForm
                    initialValues={{
                        taskDescription: maintenance.task_description,
                        hourThreshold: maintenance.hour_threshold ?? "",
                        lastServiceHours: maintenance.last_service_hours ?? "",
                        serviceDate: toDateInputValue(maintenance.service_date)
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="Salva modifiche"
                    cancelHref={`/bikes/${id}`}
                />
            )}
        </div>
    )
}
export default EditMaintenancePage
