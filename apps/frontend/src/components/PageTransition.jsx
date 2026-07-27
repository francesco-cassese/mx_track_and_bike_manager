import { motion } from "framer-motion";

/**
 * Componente wrapper per animare l'ingresso e l'uscita delle pagine
 * utilizzando framer-motion.
 */
const PageTransition = ({ children }) => {
    return (
        <motion.div
            style={{ width: "100%" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
