import { getJson, postJson, putJson, deleteRequest } from "./api";

/**
 * Recupero le sessioni registrate per una singola moto.
 */
const getSessions = (bikeId) => getJson(`/bike/${bikeId}/sessions`);

/**
 * Registro una nuova sessione per una moto.
 */
const createSession = (bikeId, { date, track, weather, feeling, hoursLogged, notes }) =>
    postJson(`/bike/${bikeId}/sessions`, { date, track, weather, feeling, hours_logged: hoursLogged, notes });

/**
 * Aggiorno i dati di una sessione esistente.
 */
const updateSession = (bikeId, sessionId, { date, track, weather, feeling, hoursLogged, notes }) =>
    putJson(`/bike/${bikeId}/sessions/${sessionId}`, { date, track, weather, feeling, hours_logged: hoursLogged, notes });

/**
 * Elimino una sessione esistente.
 */
const deleteSession = (bikeId, sessionId) => deleteRequest(`/bike/${bikeId}/sessions/${sessionId}`);

export { getSessions, createSession, updateSession, deleteSession };
