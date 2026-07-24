import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
    return (
        <div className={styles.page}>
            <svg className={styles.icon} viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="18.5" cy="17.5" r="3.5" />
                <path d="M5.5 17.5 9 10h5l3.5 7.5" />
                <path d="M9 10 7.5 6h-2" />
                <path d="M12 10l2-3h2.5" />
            </svg>
            <h1>404</h1>
            <p>Questa pagina si è persa fuoripista.</p>
            <Link to="/" className={styles.homeLink}>Torna alla dashboard</Link>
        </div>
    )
}
export default NotFoundPage
