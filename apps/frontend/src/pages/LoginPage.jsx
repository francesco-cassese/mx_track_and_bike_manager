import { useState, useRef } from "react";
import { validateLoginForm } from "../utils/validators";
import { login } from "../services/authApi";
import { getRequestErrorMessage } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useFocusFirstError } from "../hooks/useFocusFirstError";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import styles from "./LoginPage.module.css";

function LoginPage() {

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            authLogin(token)
            navigate("/")
        } catch (error) {
            setServerError(getRequestErrorMessage(error))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
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
                    />
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? "Accesso in corso..." : "Accedi"}
                    </button>
                    <Link to="/register">Non hai un account? Registrati</Link>
                </form>
            </div>
        </div>
    )
}
export default LoginPage