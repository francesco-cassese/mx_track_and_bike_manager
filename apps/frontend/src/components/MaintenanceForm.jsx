import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import FormField from "./FormField";
import { validateMaintenanceForm } from "../utils/validators";
import { getRequestErrorMessage } from "../services/api";
import { useFocusFirstError } from "../hooks/useFocusFirstError";
import styles from "./MaintenanceForm.module.css";

/**
 * Form condiviso da creazione e modifica scadenza di manutenzione: possiede
 * stato dei campi, validazione ed errore server, ma delega la vera chiamata
 * API (e la navigazione dopo il successo) al chiamante tramite onSubmit.
 */
function MaintenanceForm({ initialValues, onSubmit, submitLabel, cancelHref }) {
    const [taskDescription, setTaskDescription] = useState(initialValues.taskDescription ?? "");
    const [hourThreshold, setHourThreshold] = useState(initialValues.hourThreshold ?? "");
    const [lastServiceHours, setLastServiceHours] = useState(initialValues.lastServiceHours ?? "");
    const [serviceDate, setServiceDate] = useState(initialValues.serviceDate ?? "");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const taskDescriptionRef = useRef(null);
    const hourThresholdRef = useRef(null);
    const lastServiceHoursRef = useRef(null);
    const serviceDateRef = useRef(null);
    const fieldRefs = {
        taskDescription: taskDescriptionRef,
        hourThreshold: hourThresholdRef,
        lastServiceHours: lastServiceHoursRef,
        serviceDate: serviceDateRef
    };
    const { focusFirstError } = useFocusFirstError(fieldRefs, ["taskDescription", "hourThreshold", "lastServiceHours", "serviceDate"]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateMaintenanceForm({ taskDescription, hourThreshold, lastServiceHours, serviceDate });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            focusFirstError(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setServerError("");

        try {
            await onSubmit({
                taskDescription: taskDescription.trim(),
                hourThreshold: hourThreshold === "" ? null : Number(hourThreshold),
                lastServiceHours: lastServiceHours === "" ? null : Number(lastServiceHours),
                serviceDate: serviceDate === "" ? null : serviceDate
            });
            // In caso di successo il chiamante naviga altrove: il componente
            // sta per smontarsi, quindi non serve resettare isSubmitting qui.
        } catch (error) {
            setServerError(getRequestErrorMessage(error));
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div aria-live="polite">
                {serverError && <p className={styles.errorBanner}>{serverError}</p>}
            </div>
            <FormField
                ref={taskDescriptionRef}
                id="taskDescription"
                label="Descrizione intervento"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                error={errors.taskDescription}
                autoComplete="off"
            />
            <FormField
                ref={hourThresholdRef}
                id="hourThreshold"
                label="Soglia (ore)"
                type="number"
                value={hourThreshold}
                onChange={(e) => setHourThreshold(e.target.value)}
                error={errors.hourThreshold}
                autoComplete="off"
            />
            <FormField
                ref={lastServiceHoursRef}
                id="lastServiceHours"
                label="Ore moto all'ultimo intervento"
                type="number"
                value={lastServiceHours}
                onChange={(e) => setLastServiceHours(e.target.value)}
                error={errors.lastServiceHours}
                autoComplete="off"
            />
            <FormField
                ref={serviceDateRef}
                id="serviceDate"
                label="Data ultimo intervento"
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                error={errors.serviceDate}
                autoComplete="off"
            />
            <div className={styles.actions}>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? "Salvataggio in corso..." : submitLabel}
                </button>
                {cancelHref && <Link to={cancelHref}>Annulla</Link>}
            </div>
        </form>
    )
}
export default MaintenanceForm
