/**
 * Wrappo i controller async per inoltrare automaticamente le eccezioni
 * all'error-handler centralizzato di Express, evitando try/catch ripetuti.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export { asyncHandler };
