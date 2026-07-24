import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

/**
 * Landing page pubblica: primo impatto sul sito per un visitatore non
 * autenticato. Sezione hero accattivante, seguita da una spiegazione
 * delle feature principali.
 */
function LandingPage() {
    return (
        <div className={styles.landingPage}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>MX Garage</h1>
                    <p className={styles.tagline}>
                        Il tuo box digitale. Tieni traccia di moto, allenamenti e manutenzioni in un unico posto per dominare la pista.
                    </p>
                    <div className={styles.actions}>
                        <Link to="/register" className={styles.primaryButton}>Inizia Ora</Link>
                        <Link to="/login" className={styles.secondaryButton}>Accedi</Link>
                    </div>
                </div>
                
                {/* Scroll Indicator */}
                <div className={styles.scrollIndicator}>
                    <span className={styles.scrollArrow}></span>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.featuresSection}>
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
