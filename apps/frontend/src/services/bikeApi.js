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
 * Creo una nuova moto per l'utente loggato.
 */
const createBike = ({ brand, model, year, vin, status }) => postJson('/bike', { brand, model, year, vin, status });

/**
 * Aggiorno i dati di una moto esistente.
 */
const updateBike = (id, { brand, model, year, vin, status }) => putJson(`/bike/${id}`, { brand, model, year, vin, status });

/**
 * Elimino una moto esistente.
 */
const deleteBike = (id) => deleteRequest(`/bike/${id}`);

export { getBikes, getBike, createBike, updateBike, deleteBike };
