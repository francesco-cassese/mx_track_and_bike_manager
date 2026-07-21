import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import FormField from "./FormField";
import { validateBikeForm } from "../utils/validators";
import { getRequestErrorMessage } from "../services/api";
import { useFocusFirstError } from "../hooks/useFocusFirstError";
import styles from "./BikeForm.module.css";

/**
 * Form condiviso da creazione e modifica moto: possiede stato dei campi,
 * validazione ed errore server, ma delega la vera chiamata API (e la
 * navigazione dopo il successo) al chiamante tramite onSubmit.
 */
function BikeForm({ initialValues, onSubmit, submitLabel, cancelHref }) {
    const [brand, setBrand] = useState(initialValues.brand ?? "");
    const [model, setModel] = useState(initialValues.model ?? "");
    const [year, setYear] = useState(initialValues.year ?? "");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const brandRef = useRef(null);
    const modelRef = useRef(null);
    const yearRef = useRef(null);
    const fieldRefs = { brand: brandRef, model: modelRef, year: yearRef };
    const { focusFirstError } = useFocusFirstError(fieldRefs, ["brand", "model", "year"]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateBikeForm({ brand, model, year });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            focusFirstError(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setServerError("");

        try {
            await onSubmit({ brand: brand.trim(), model: model.trim(), year: Number(year) });
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
                ref={brandRef}
                id="brand"
                label="Marca"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                error={errors.brand}
                autoComplete="off"
            />
            <FormField
                ref={modelRef}
                id="model"
                label="Modello"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                error={errors.model}
                autoComplete="off"
            />
            <FormField
                ref={yearRef}
                id="year"
                label="Anno"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                error={errors.year}
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
export default BikeForm
