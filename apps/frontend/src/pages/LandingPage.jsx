import { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

/* Icone inline (nessuna dipendenza esterna): usano currentColor così lo
   stile si controlla interamente da CSS. */
const IconSearch = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconUser = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
);

const IconInstagram = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
);

const IconFacebook = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5H16V4.3C15.6 4.2 14.7 4 13.6 4c-2.3 0-3.9 1.4-3.9 4v2.5H7v3h2.7V21h3.8z" />
    </svg>
);

const IconYoutube = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.7v1.6c0 1.7.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.7.2 7.4.2 7.4.2s3.9 0 6.7-.3c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.5v-1.6c0-1.7-.2-3.5-.2-3.5zM9.9 14.6V8.9l5.4 2.9-5.4 2.8z" />
    </svg>
);

/**
 * Landing page pubblica: primo impatto sul sito per un visitatore non
 * autenticato. Navbar in stile app, hero a schermo intero con foto pilota
 * in salto, e sezione feature sotto lo scroll.
 */
function LandingPage() {
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.landingPage}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.navBrand}>
                    <img src="/logo.png" alt="MX Garage" className={styles.navLogo} />
                </div>

                <ul className={styles.navLinks}>
                    <li><a href="#features">FEATURES</a></li>
                    <li className={styles.separator}>|</li>
                    <li><a href="#" onClick={(e) => e.preventDefault()}>TRACKS</a></li>
                    <li className={styles.separator}>|</li>
                    <li><a href="#" onClick={(e) => e.preventDefault()}>COMMUNITY</a></li>
                    <li className={styles.separator}>|</li>
                    <li><Link to="/login">ACCOUNT</Link></li>
                </ul>

                <div className={styles.navActions}>
                    <Link to="/login" className={styles.signInButton}>SIGN IN</Link>
                    <button type="button" className={styles.iconButton} aria-label="Cerca">
                        <IconSearch className={styles.icon} />
                    </button>
                    <div className={styles.avatar} aria-hidden="true">
                        <IconUser className={styles.icon} />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroImage} />

                <div className={styles.heroBottom}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.title}>MX GARAGE</h1>
                        <p className={styles.tagline}>Il tuo box digitale</p>
                        <div className={styles.actions}>
                            <Link to="/register" className={styles.primaryButton}>INIZIA ORA</Link>
                            <Link to="/login" className={styles.secondaryButton}>ACCEDI</Link>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className={styles.scrollIndicator}>
                    <span className={styles.scrollLabel}>SCROLL DOWN</span>
                    <span className={styles.scrollArrow}></span>
                </div>

                {/* Social Links */}
                <div className={styles.socialLinks}>
                    <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram"><IconInstagram className={styles.icon} /></a>
                    <a href="#" onClick={(e) => e.preventDefault()} aria-label="Facebook"><IconFacebook className={styles.icon} /></a>
                    <a href="#" onClick={(e) => e.preventDefault()} aria-label="YouTube"><IconYoutube className={styles.icon} /></a>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={styles.featuresSection}>
                <div className={styles.featuresContainer}>
                    <h2 className={styles.sectionTitle}>Tutto sotto controllo</h2>
                    <div className={styles.featuresGrid}>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🏍️</div>
                            <h3>Gestione Moto</h3>
                            <p>Aggiungi le tue moto da cross. Monitora l'usura e tieni sempre sotto controllo lo stato del tuo parco moto.</p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>⏱️</div>
                            <h3>Sessioni in Pista</h3>
                            <p>Registra ogni allenamento o gara. Tieni traccia delle ore del motore per una manutenzione millimetrica.</p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🔧</div>
                            <h3>Manutenzione</h3>
                            <p>Non rischiare rotture. Ricevi alert automatici quando è ora di cambiare olio, pistone o rifare le sospensioni.</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} MX Garage. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default LandingPage;
