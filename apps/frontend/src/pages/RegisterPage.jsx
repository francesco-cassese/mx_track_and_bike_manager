import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormField from "../components/FormField";
import { validateRegisterForm } from "../utils/validators";
import { register } from "../services/authApi";
import { getRequestErrorMessage } from "../services/api";
import { useFocusFirstError } from "../hooks/useFocusFirstError";
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
    const { focusFirstError } = useFocusFirstError(fieldRefs, ["name", "email", "password", "confirmPassword"]);
    const redirectTimeoutRef = useRef(null);

    // Se la pagina viene smontata prima dello scadere del redirect (es. l'utente
    // naviga via manualmente), evito che il timeout scatti comunque a componente smontato
    useEffect(() => () => clearTimeout(redirectTimeoutRef.current), []);

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
            redirectTimeoutRef.current = setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            if (error.status === 409) {
                setErrors((prev) => ({ ...prev, email: error.message }));
                emailRef.current?.focus();
            } else {
                setServerError(getRequestErrorMessage(error));
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
                        autoComplete="name"
                    />
                    <FormField
                        ref={emailRef}
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        autoComplete="email"
                    />
                    <FormField
                        ref={passwordRef}
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        autoComplete="new-password"
                    />
                    <FormField
                        ref={confirmPasswordRef}
                        id="confirmPassword"
                        label="Conferma password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                        autoComplete="new-password"
                    />
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? "Registrazione in corso..." : "Registrati"}
                    </button>
                    <Link to="/login">Hai già un account? Accedi</Link>
                </form>
            </div>
        </div>
    )
}
export default RegisterPage