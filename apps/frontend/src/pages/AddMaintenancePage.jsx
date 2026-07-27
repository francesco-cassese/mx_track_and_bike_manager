import { useParams, useNavigate } from "react-router-dom";
import MaintenanceForm from "../components/MaintenanceForm";
import { createMaintenance } from "../services/maintenanceApi";
import styles from "./AddMaintenancePage.module.css";

/**
 * Pagina di creazione scadenza di manutenzione per una moto: il vero
 * submit/errore è gestito da MaintenanceForm, qui mi limito a chiamare
 * l'API e a decidere dove andare dopo il successo.
 */
function AddMaintenancePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        await createMaintenance(id, values);
        navigate(`/bikes/${id}`);
    };

    return (
        <div className={`${styles.page} px-4 mx-auto`}>
            <h1 className="pb-3">Aggiungi manutenzione</h1>
            <MaintenanceForm
                initialValues={{ taskDescription: "", hourThreshold: "", lastServiceHours: "", serviceDate: "" }}
                onSubmit={handleSubmit}
                submitLabel="Aggiungi manutenzione"
                cancelHref={`/bikes/${id}`}
            />
        </div>
    )
}
export default AddMaintenancePage
