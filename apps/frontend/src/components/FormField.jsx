import styles from "./FormField.module.css";

/**
 * Campo di form riusabile con label, stato di errore e relativo messaggio.
 * L'`aria-describedby` collega il campo al messaggio d'errore solo quando
 * esiste, così gli screen reader non annunciano un riferimento vuoto.
 */
function FormField({ label, id, type = "text", value, onChange, error, ref }) {
    return (
        <div className={`${styles.inputGroup}${error ? ` ${styles.hasError}` : ""}`}>
            <label htmlFor={id}>{label}</label>
            <input
                ref={ref}
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                aria-describedby={error ? `${id}-error` : undefined}
            />

            {error && (
                <span id={`${id}-error`} className={styles.errorText}>
                    {error}
                </span>
            )}
        </div>
    )
}
export default FormField