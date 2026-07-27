import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormField from "../components/FormField";
import { validateRegisterForm } from "../utils/validators";
import { register } from "../services/authApi";
import { getRequestErrorMessage } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useFocusFirstError } from "../hooks/useFocusFirstError";
import styles from "./RegisterPage.module.css";

const nameIcon = (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
);

const emailIcon = (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
    </svg>
);

const passwordIcon = (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

/**
 * Pagina di registrazione: valida i campi lato client prima di chiamare
 * l'API, poi gestisce distintamente i tre esiti possibili (successo,
 * email duplicata, altri errori) coerentemente con quanto risponde il backend.
 */
function RegisterPage() {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
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
            const { token } = await register({ name, email, password });
            authLogin(token);
            setSuccessMessage("Registrazione completata! Reindirizzamento...");
            redirectTimeoutRef.current = setTimeout(() => navigate("/"), 1500);
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
            <nav className={styles.navbar}>
                <Link to="/" className={styles.navBrand}>
                    <img src="/logo.png" alt="MX Garage" className={styles.navLogo} />
                </Link>
                <Link to="/" className={styles.navHomeLink}>Home</Link>
            </nav>
            <div className={styles.authContent}>
                <div className={styles.authCard}>
                    <img src="/logo.png" alt="MX Garage" className={styles.logo} />
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
                            icon={nameIcon}
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
                            icon={emailIcon}
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
                            icon={passwordIcon}
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
                            icon={passwordIcon}
                        />
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? "Registrazione in corso..." : "Registrati"}
                        </button>
                        <Link to="/login" className={styles.switchLink}>Hai già un account? Accedi</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default RegisterPage