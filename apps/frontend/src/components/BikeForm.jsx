import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import FormField from "./FormField";
import SelectField from "./SelectField";
import { validateBikeForm, BIKE_STATUSES } from "../utils/validators";
import { getRequestErrorMessage } from "../services/api";
import { useFocusFirstError } from "../hooks/useFocusFirstError";
import { MOTORCYCLE_BRANDS, CUSTOM_BRAND, findBrandKey, findModelForBrand } from "../data/motorcycleBrands";
import styles from "./BikeForm.module.css";

const BRAND_OPTIONS = [
    ...Object.keys(MOTORCYCLE_BRANDS).map((name) => ({ value: name, label: name })),
    { value: CUSTOM_BRAND, label: "Altra marca..." },
];

const STATUS_LABELS = {
    active: "Attiva",
    ready: "Pronta",
    maintenance: "In manutenzione",
};
const STATUS_OPTIONS = BIKE_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));

/**
 * Ricostruisco lo stato iniziale delle select a partire da marca/modello
 * salvati (usato in modifica): se la marca non è nel catalogo, o il modello
 * non è tra quelli noti per quella marca, ricado sui campi "personalizzati"
 * così il dato esistente non va perso.
 */
const buildInitialBikeState = (rawBrand, rawModel) => {
    const matchedBrand = findBrandKey(rawBrand);

    if (!matchedBrand) {
        return {
            brand: rawBrand ? CUSTOM_BRAND : "",
            customBrand: rawBrand ?? "",
            model: CUSTOM_BRAND,
            customModel: rawModel ?? "",
        };
    }

    const matchedModel = findModelForBrand(matchedBrand, rawModel);
    return {
        brand: matchedBrand,
        customBrand: "",
        model: matchedModel ?? CUSTOM_BRAND,
        customModel: matchedModel ? "" : rawModel ?? "",
    };
};

/**
 * Form condiviso da creazione e modifica moto: possiede stato dei campi,
 * validazione ed errore server, ma delega la vera chiamata API (e la
 * navigazione dopo il successo) al chiamante tramite onSubmit.
 */
function BikeForm({ initialValues, onSubmit, submitLabel, cancelHref }) {
    const [{ brand, customBrand, model, customModel }, setBikeState] = useState(() =>
        buildInitialBikeState(initialValues.brand, initialValues.model)
    );
    const [year, setYear] = useState(initialValues.year ?? "");
    const [vin, setVin] = useState(initialValues.vin ?? "");
    const [status, setStatus] = useState(initialValues.status ?? "active");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const isCustomBrand = brand === CUSTOM_BRAND;
    const isCustomModel = isCustomBrand || model === CUSTOM_BRAND;
    const modelOptions = [
        ...(MOTORCYCLE_BRANDS[brand] ?? []).map((name) => ({ value: name, label: name })),
        { value: CUSTOM_BRAND, label: "Altro modello..." },
    ];

    const brandSelectRef = useRef(null);
    const customBrandRef = useRef(null);
    const modelSelectRef = useRef(null);
    const customModelRef = useRef(null);
    const yearRef = useRef(null);
    const vinRef = useRef(null);
    const statusRef = useRef(null);
    const fieldRefs = {
        brand: isCustomBrand ? customBrandRef : brandSelectRef,
        model: isCustomModel ? customModelRef : modelSelectRef,
        year: yearRef,
        vin: vinRef,
        status: statusRef,
    };
    const { focusFirstError } = useFocusFirstError(fieldRefs, ["brand", "model", "year", "vin", "status"]);

    const handleBrandChange = (e) => {
        const value = e.target.value;
        setBikeState({
            brand: value,
            customBrand: value === CUSTOM_BRAND ? customBrand : "",
            model: "",
            customModel: "",
        });
    };

    const handleModelChange = (e) => {
        const value = e.target.value;
        setBikeState((prev) => ({ ...prev, model: value, customModel: value === CUSTOM_BRAND ? prev.customModel : "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalBrand = isCustomBrand ? customBrand.trim() : brand;
        const finalModel = isCustomModel ? customModel.trim() : model;

        const validationErrors = validateBikeForm({ brand: finalBrand, model: finalModel, year, vin, status });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            focusFirstError(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setServerError("");

        try {
            await onSubmit({ brand: finalBrand, model: finalModel, year: Number(year), vin: vin.trim(), status });
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
                ref={brandSelectRef}
                id="brand"
                label="Marca"
                value={brand}
                onChange={handleBrandChange}
                options={BRAND_OPTIONS}
                placeholder="Seleziona una marca"
                error={isCustomBrand ? undefined : errors.brand}
            />
            {isCustomBrand && (
                <FormField
                    ref={customBrandRef}
                    id="customBrand"
                    label="Nome marca"
                    value={customBrand}
                    onChange={(e) => setBikeState((prev) => ({ ...prev, customBrand: e.target.value }))}
                    error={errors.brand}
                    autoComplete="off"
                />
            )}

            {!isCustomBrand && (
                <SelectField
                    ref={modelSelectRef}
                    id="model"
                    label="Modello"
                    value={model}
                    onChange={handleModelChange}
                    options={modelOptions}
                    placeholder={brand ? "Seleziona un modello" : "Seleziona prima una marca"}
                    disabled={!brand}
                    error={isCustomModel ? undefined : errors.model}
                />
            )}
            {isCustomModel && (
                <FormField
                    ref={customModelRef}
                    id="customModel"
                    label={isCustomBrand ? "Modello" : "Nome modello"}
                    value={customModel}
                    onChange={(e) => setBikeState((prev) => ({ ...prev, customModel: e.target.value }))}
                    error={errors.model}
                    autoComplete="off"
                />
            )}
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
            <FormField
                ref={vinRef}
                id="vin"
                label="Telaio (VIN)"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                error={errors.vin}
                autoComplete="off"
            />
            <SelectField
                ref={statusRef}
                id="status"
                label="Stato"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={STATUS_OPTIONS}
                error={errors.status}
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
export default BikeForm
