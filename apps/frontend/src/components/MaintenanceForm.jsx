import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import FormField from "./FormField";
import SelectField from "./SelectField";
import { validateMaintenanceForm } from "../utils/validators";
import { getRequestErrorMessage } from "../services/api";
import { useFocusFirstError } from "../hooks/useFocusFirstError";
import { MAINTENANCE_TYPES, CUSTOM_MAINTENANCE_TYPE, findMaintenanceType } from "../data/maintenanceTypes";
import styles from "./MaintenanceForm.module.css";

const TYPE_OPTIONS = [
    ...MAINTENANCE_TYPES.map((type) => ({ value: type.label, label: type.label })),
    { value: CUSTOM_MAINTENANCE_TYPE, label: "Altro" },
];

/**
 * Ricostruisco lo stato iniziale della select a partire dalla descrizione
 * salvata (usato in modifica): se non corrisponde a un intervento noto del
 * catalogo, ricado sul campo "personalizzato" così il dato esistente non va perso.
 */
const buildInitialTaskState = (rawDescription) => {
    const matchedType = findMaintenanceType(rawDescription);
    if (matchedType) {
        return { taskType: matchedType.label, customDescription: "" };
    }
    return { taskType: rawDescription ? CUSTOM_MAINTENANCE_TYPE : "", customDescription: rawDescription ?? "" };
};

/**
 * Form condiviso da creazione e modifica scadenza di manutenzione: possiede
 * stato dei campi, validazione ed errore server, ma delega la vera chiamata
 * API (e la navigazione dopo il successo) al chiamante tramite onSubmit.
 */
function MaintenanceForm({ initialValues, onSubmit, submitLabel, cancelHref }) {
    const [{ taskType, customDescription }, setTaskState] = useState(() =>
        buildInitialTaskState(initialValues.taskDescription)
    );
    const [hourThreshold, setHourThreshold] = useState(initialValues.hourThreshold ?? "");
    const [lastServiceHours, setLastServiceHours] = useState(initialValues.lastServiceHours ?? "");
    const [serviceDate, setServiceDate] = useState(initialValues.serviceDate ?? "");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const isCustomType = taskType === CUSTOM_MAINTENANCE_TYPE;
    const taskDescription = isCustomType ? customDescription.trim() : taskType;

    const taskTypeRef = useRef(null);
    const customDescriptionRef = useRef(null);
    const hourThresholdRef = useRef(null);
    const lastServiceHoursRef = useRef(null);
    const serviceDateRef = useRef(null);
    const fieldRefs = {
        taskDescription: isCustomType ? customDescriptionRef : taskTypeRef,
        hourThreshold: hourThresholdRef,
        lastServiceHours: lastServiceHoursRef,
        serviceDate: serviceDateRef
    };
    const { focusFirstError } = useFocusFirstError(fieldRefs, ["taskDescription", "hourThreshold", "lastServiceHours", "serviceDate"]);

    /**
     * Al cambio tipo, precompilo la soglia ore col default suggerito per
     * quell'intervento, ma solo se non è già stata impostata: così non
     * sovrascrivo un valore che l'utente ha già inserito/modificato.
     */
    const handleTypeChange = (e) => {
        const value = e.target.value;
        setTaskState((prev) => ({ taskType: value, customDescription: value === CUSTOM_MAINTENANCE_TYPE ? prev.customDescription : "" }));

        const matchedType = MAINTENANCE_TYPES.find((type) => type.label === value);
        if (matchedType && hourThreshold === "") {
            setHourThreshold(String(matchedType.defaultIntervalHours));
        }
    };

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
                taskDescription,
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
        <form onSubmit={handleSubmit} noValidate className={`${styles.form} mw-100`}>
            <div aria-live="polite">
                {serverError && <p className={`${styles.errorBanner} mb-4 px-3`}>{serverError}</p>}
            </div>
            <SelectField
                ref={taskTypeRef}
                id="taskType"
                label="Tipo di intervento"
                value={taskType}
                onChange={handleTypeChange}
                options={TYPE_OPTIONS}
                placeholder="Seleziona un intervento"
                error={isCustomType ? undefined : errors.taskDescription}
            />
            {isCustomType && (
                <FormField
                    ref={customDescriptionRef}
                    id="customDescription"
                    label="Descrizione intervento"
                    value={customDescription}
                    onChange={(e) => setTaskState((prev) => ({ ...prev, customDescription: e.target.value }))}
                    error={errors.taskDescription}
                    autoComplete="off"
                />
            )}
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
            <div className={`${styles.actions} gap-3 mt-4`}>
                <button type="submit" className={`${styles.submitButton} px-4`} disabled={isSubmitting}>
                    {isSubmitting ? "Salvataggio in corso..." : submitLabel}
                </button>
                {cancelHref && <Link to={cancelHref}>Annulla</Link>}
            </div>
        </form>
    )
}
export default MaintenanceForm
