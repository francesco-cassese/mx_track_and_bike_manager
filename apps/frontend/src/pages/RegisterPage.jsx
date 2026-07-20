import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { validateRegisterForm } from "../utils/validators";
import { register } from "../services/authApi";
import styles from "./RegisterPage.module.css";


/**
 * Pagina di registrazione: valida i campi lato client prima di chiamare
 * l'API, poi gestisce distintamente i tre esiti possibili (successo,
 * email duplicata, altri errori) coerentemente con quanto risponde il backend.
 */
function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const fieldRefs = { name: nameRef, email: emailRef, password: passwordRef, confirmPassword: confirmPasswordRef };
    const fieldOrder = ["name", "email", "password", "confirmPassword"];

    // Sposto il focus sul primo campo invalido (in ordine di apparizione nel form),
    // così l'utente da tastiera/screen reader arriva subito dove serve intervenire
    const focusFirstError = (errorsToCheck) => {
        const firstInvalidField = fieldOrder.find((field) => errorsToCheck[field]);
        fieldRefs[firstInvalidField]?.current?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateRegisterForm({ name, email, password, confirmPassword });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            focusFirstError(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setServerError("");

        try {
            await register({ name, email, password });
            setSuccessMessage("Registrazione completata! Reindirizzamento al login...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            if (error.status === 409) {
                setErrors((prev) => ({ ...prev, email: error.message }));
                emailRef.current?.focus();
            } else if (error.status) {
                // Errore risposto dal backend (es. 400 imprevisto, 500): uso il suo messaggio
                setServerError(error.message);
            } else {
                // fetch ha fallito prima di ricevere una risposta (es. rete offline): niente status
                setServerError("Impossibile contattare il server. Controlla la connessione.");
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <h1>Registrati</h1>
                <div aria-live="polite">
                    {successMessage && <p className={styles.successText}>{successMessage}</p>}
                </div>
                <div aria-live="polite">
                    {serverError && <p className={styles.errorBanner}>{serverError}</p>}
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <FormField
                        ref={nameRef}
                        id="name"
                        label="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                    />
                    <FormField
                        ref={emailRef}
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                    />
                    <FormField
                        ref={passwordRef}
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />
                    <FormField
                        ref={confirmPasswordRef}
                        id="confirmPassword"
                        label="Conferma password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                    />
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? "Registrazione in corso..." : "Registrati"}
                    </button>
                </form>
            </div>
        </div>
    )
}
export default RegisterPage