/**
 * Uniformo la shape delle risposte JSON dell'API: { success, ...payload }.
 */
const sendSuccess = (res, status, payload = {}) => {
    res.status(status).json({ success: true, ...payload });
};

/**
 * Stessa shape delle risposte di successo, ma con un messaggio al posto del payload.
 */
const sendError = (res, status, message) => {
    res.status(status).json({ success: false, message });
};

export { sendSuccess, sendError };
