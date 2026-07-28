/**
 * Catalogo interventi di manutenzione più comuni, con intervallo (in ore
 * motore) suggerito come default per la soglia. Non è un vincolo: chi ha
 * un intervento non presente può comunque usare l'opzione "Altro" e
 * inserirlo a testo libero.
 */
const CUSTOM_MAINTENANCE_TYPE = "__custom__";

const MAINTENANCE_TYPES = [
    { label: "Olio motore", defaultIntervalHours: 10 },
    { label: "Filtro aria", defaultIntervalHours: 5 },
    { label: "Candela", defaultIntervalHours: 15 },
    { label: "Catena e pignoni", defaultIntervalHours: 15 },
    { label: "Pastiglie freno anteriore", defaultIntervalHours: 20 },
    { label: "Pastiglie freno posteriore", defaultIntervalHours: 20 },
    { label: "Liquido freni", defaultIntervalHours: 40 },
    { label: "Liquido di raffreddamento", defaultIntervalHours: 50 },
    { label: "Revisione generale", defaultIntervalHours: 50 },
];

/**
 * Trovo il tipo di intervento corrispondente in modo case-insensitive, utile
 * per precompilare la select con dati salvati (es. "olio motore" -> "Olio motore").
 */
const findMaintenanceType = (rawLabel) => {
    if (!rawLabel) return null;
    const normalized = rawLabel.trim().toLowerCase();
    return MAINTENANCE_TYPES.find((type) => type.label.toLowerCase() === normalized) ?? null;
};

export { MAINTENANCE_TYPES, CUSTOM_MAINTENANCE_TYPE, findMaintenanceType };
