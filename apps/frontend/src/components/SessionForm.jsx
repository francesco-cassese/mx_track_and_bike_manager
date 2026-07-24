import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import FormField from "./FormField";
import { validateSessionForm } from "../utils/validators";
import { getRequestErrorMessage } from "../services/api";
import { useFocusFirstError } from "../hooks/useFocusFirstError";
import styles from "./SessionForm.module.css";

/**
 * Form condiviso da creazione e modifica sessione (allenamento): possiede
 * stato dei campi, validazione ed errore server, ma delega la vera chiamata
 * API (e la navigazione dopo il successo) al chiamante tramite onSubmit.
 */
function SessionForm({ initialValues, onSubmit, submitLabel, cancelHref }) {
    const [date, setDate] = useState(initialValues.date ?? "");
    const [track, setTrack] = useState(initialValues.track ?? "");
    const [weather, setWeather] = useState(initialValues.weather ?? "");
    const [feeling, setFeeling] = useState(initialValues.feeling ?? "");
    const [hoursLogged, setHoursLogged] = useState(initialValues.hoursLogged ?? "");
    const [notes, setNotes] = useState(initialValues.notes ?? "");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const dateRef = useRef(null);
    const trackRef = useRef(null);
    const weatherRef = useRef(null);
    const feelingRef = useRef(null);
    const hoursLoggedRef = useRef(null);
    const fieldRefs = { date: dateRef, track: trackRef, weather: weatherRef, feeling: feelingRef, hoursLogged: hoursLoggedRef };
    const { focusFirstError } = useFocusFirstError(fieldRefs, ["date", "track", "weather", "feeling", "hoursLogged"]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateSessionForm({ date, track, hoursLogged, feeling });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            focusFirstError(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setServerError("");

        try {
            await onSubmit({
                date,
                track: track.trim(),
                weather: weather.trim() || null,
                feeling: feeling === "" ? null : Number(feeling),
                hoursLogged: hoursLogged === "" ? null : Number(hoursLogged),
                notes: notes.trim() || null
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
                ref={dateRef}
                id="date"
                label="Data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                error={errors.date}
                autoComplete="off"
            />
            <FormField
                ref={trackRef}
                id="track"
                label="Pista"
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                error={errors.track}
                autoComplete="off"
            />
            <FormField
                ref={weatherRef}
                id="weather"
                label="Meteo"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                error={errors.weather}
                autoComplete="off"
            />
            <FormField
                ref={feelingRef}
                id="feeling"
                label="Sensazioni (1-5)"
                type="number"
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                error={errors.feeling}
                autoComplete="off"
            />
            <FormField
                ref={hoursLoggedRef}
                id="hoursLogged"
                label="Ore"
                type="number"
                value={hoursLogged}
                onChange={(e) => setHoursLogged(e.target.value)}
                error={errors.hoursLogged}
                autoComplete="off"
            />
            <div className={styles.inputGroup}>
                <label htmlFor="notes">Note</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                />
            </div>
            <div className={styles.actions}>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? "Salvataggio in corso..." : submitLabel}
                </button>
                {cancelHref && <Link to={cancelHref}>Annulla</Link>}
            </div>
        </form>
    )
}
export default SessionForm
