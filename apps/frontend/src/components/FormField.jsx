import { useState } from "react";
import styles from "./FormField.module.css";

/**
 * Campo di form riusabile con label, stato di errore e relativo messaggio.
 * L'`aria-describedby` collega il campo al messaggio d'errore solo quando
 * esiste, così gli screen reader non annunciano un riferimento vuoto.
 * Per i campi password mostra un pulsante che ne alterna la visibilità.
 */
function FormField({ label, id, type = "text", value, onChange, error, autoComplete, ref }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordField = type === "password";
    const inputType = isPasswordField && isPasswordVisible ? "text" : type;

    return (
        <div className={`${styles.inputGroup}${error ? ` ${styles.hasError}` : ""}`}>
            <label htmlFor={id}>{label}</label>
            <div className={styles.inputWrapper}>
                <input
                    ref={ref}
                    id={id}
                    name={id}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
                {isPasswordField && (
                    <button
                        type="button"
                        className={styles.togglePasswordButton}
                        onClick={() => setIsPasswordVisible((visible) => !visible)}
                        aria-label={isPasswordVisible ? "Nascondi password" : "Mostra password"}
                        aria-pressed={isPasswordVisible}
                        tabIndex={-1}
                    >
                        {isPasswordVisible ? (
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                                <line x1="3" y1="21" x2="21" y2="3" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {error && (
                <span id={`${id}-error`} className={styles.errorText}>
                    {error}
                </span>
            )}
        </div>
    )
}
export default FormField