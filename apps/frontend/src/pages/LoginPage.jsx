import { useState, useRef } from "react";
import { validateLoginForm } from "../utils/validators";
import { login } from "../services/authApi";
import { getRequestErrorMessage } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useFocusFirstError } from "../hooks/useFocusFirstError";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import styles from "./LoginPage.module.css";

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

function LoginPage() {

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const fieldRefs = { email: emailRef, password: passwordRef };
    const { focusFirstError } = useFocusFirstError(fieldRefs, ["email", "password"]);

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validateLoginForm({ email, password });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            focusFirstError(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setServerError("");

        try {
            const { token } = await login({ email, password })
            authLogin(token, rememberMe)
            navigate("/")
        } catch (error) {
            setServerError(getRequestErrorMessage(error))
        } finally {
            setIsSubmitting(false)
        }
    }

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
                    <h1>Accedi</h1>
                    <div aria-live="polite">
                        {serverError && <p className={styles.errorBanner}>{serverError}</p>}
                    </div>
                    <form onSubmit={handleSubmit} noValidate>
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
                            autoComplete="current-password"
                            icon={passwordIcon}
                        />
                        <label className={styles.rememberLabel}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Ricordami
                        </label>
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? "Accesso in corso..." : "Accedi"}
                        </button>
                        <Link to="/register" className={styles.switchLink}>Non hai un account? Registrati</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default LoginPage