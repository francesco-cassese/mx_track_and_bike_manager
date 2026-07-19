/**
 * Converto un id ricevuto come parametro di rotta in un intero positivo.
 * Restituisco null se il valore non è una sequenza di sole cifre
 * (es. "5abc", "-1", "1.5"), così il chiamante può rispondere con un 400.
 */
const parseResourceId = (rawId) => {
    if (!/^\d+$/.test(rawId)) {
        return null;
    }

    return parseInt(rawId, 10);
};

export { parseResourceId };
