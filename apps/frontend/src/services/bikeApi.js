import { getJson, postJson, putJson, deleteRequest } from "./api";

/**
 * Recupero le moto dell'utente loggato.
 */
const getBikes = () => getJson('/bike');

/**
 * Recupero il dettaglio di una singola moto (include già totalHours).
 */
const getBike = (id) => getJson(`/bike/${id}`);

/**
 * Recupero il totale di ore di utilizzo di una singola moto.
 */
const getBikeTotalHours = (id) => getJson(`/bike/${id}/total-hours`);

/**
 * Recupero le manutenzioni scadute o in scadenza per una singola moto.
 */
const getBikeAlerts = (id) => getJson(`/bike/${id}/alert`);

/**
 * Creo una nuova moto per l'utente loggato.
 */
const createBike = ({ brand, model, year }) => postJson('/bike', { brand, model, year });

/**
 * Aggiorno i dati di una moto esistente.
 */
const updateBike = (id, { brand, model, year }) => putJson(`/bike/${id}`, { brand, model, year });

/**
 * Elimino una moto esistente.
 */
const deleteBike = (id) => deleteRequest(`/bike/${id}`);

export { getBikes, getBike, getBikeTotalHours, getBikeAlerts, createBike, updateBike, deleteBike };
