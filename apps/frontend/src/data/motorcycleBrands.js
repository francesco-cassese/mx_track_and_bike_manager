/**
 * Catalogo marche/modelli off-road usato per precompilare le select del form
 * moto. Non è un vincolo: chi possiede una marca o un modello non presente
 * può comunque usare l'opzione "Altro" e inserirlo a testo libero.
 */
const CUSTOM_BRAND = "__custom__";

const MOTORCYCLE_BRANDS = {
    Beta: ["RR 125 2T", "RR 200 2T", "RR 250 2T", "RR 300 2T", "RR 350 4T", "RR 430 4T", "RR 480 4T", "Xtrainer 300"],
    Fantic: ["XX 125", "XX 250", "XX 300", "XXF 250", "XXF 450"],
    "GasGas": ["MC 125", "MC 250F", "MC 450F", "EC 250", "EC 300", "EX 350F"],
    Honda: ["CRF150R", "CRF250R", "CRF450R", "CRF250RX", "CRF450RX", "CRF450RWE", "CRF300L", "CRF450X"],
    Husqvarna: ["TC 125", "TC 250", "FC 250", "FC 350", "FC 450", "TE 150", "TE 300", "FE 350", "FE 450", "FE 501"],
    Kawasaki: ["KX112", "KX250", "KX450", "KLX300R", "KX450X"],
    KTM: ["125 SX", "150 SX", "250 SX", "250 SX-F", "350 SX-F", "450 SX-F", "300 EXC", "350 EXC-F", "450 EXC-F", "500 EXC-F"],
    Sherco: ["250 SE Factory", "300 SE Factory", "450 SEF Factory"],
    Suzuki: ["RM85", "RM-Z250", "RM-Z450"],
    TM: ["MX 125", "MX 250Fi", "MX 300Fi", "EN 250Fi", "EN 450Fi"],
    Yamaha: ["YZ125", "YZ250", "YZ250F", "YZ450F", "YZ250FX", "YZ450FX", "WR250F", "WR450F"],
};

/**
 * Trovo la chiave marca corrispondente in modo case-insensitive, utile per
 * precompilare la select con dati salvati (es. "ktm" -> "KTM").
 */
const findBrandKey = (rawBrand) => {
    if (!rawBrand) return null;
    const normalized = rawBrand.trim().toLowerCase();
    return Object.keys(MOTORCYCLE_BRANDS).find((key) => key.toLowerCase() === normalized) ?? null;
};

/**
 * Come findBrandKey ma per il modello, cercando solo tra quelli della marca indicata.
 */
const findModelForBrand = (brandKey, rawModel) => {
    if (!rawModel || !MOTORCYCLE_BRANDS[brandKey]) return null;
    const normalized = rawModel.trim().toLowerCase();
    return MOTORCYCLE_BRANDS[brandKey].find((model) => model.toLowerCase() === normalized) ?? null;
};

export { MOTORCYCLE_BRANDS, CUSTOM_BRAND, findBrandKey, findModelForBrand };
