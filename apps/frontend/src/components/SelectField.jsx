import fieldStyles from "./FormField.module.css";
import styles from "./SelectField.module.css";

/**
 * Select con lo stesso stile/layout di FormField (label, wrapper, errore),
 * ma con una freccia disegnata a mano perché quella nativa del browser non
 * segue il tema dell'app.
 */
function SelectField({ label, id, value, onChange, error, options, placeholder, disabled, ref }) {
    return (
        <div className={`${fieldStyles.inputGroup} gap-2 mb-4${error ? ` ${fieldStyles.hasError}` : ""}`}>
            <label htmlFor={id}>{label}</label>
            <div className={fieldStyles.inputWrapper}>
                <select
                    ref={ref}
                    id={id}
                    name={id}
                    className={`w-100 pe-5 ${styles.select}`}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    aria-describedby={error ? `${id}-error` : undefined}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <svg className={styles.chevron} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </div>

            {error && (
                <span id={`${id}-error`} className={fieldStyles.errorText}>
                    {error}
                </span>
            )}
        </div>
    )
}
export default SelectField
