/**
 * Immagini statiche associate a marca/modello: se marca o modello contengono
 * la chiave (case-insensitive), uso quella foto al posto dell'icona generica.
 * Le chiavi che sono sottostringa di un'altra più specifica (es. "tm" dentro
 * "ktm") vanno elencate dopo quella più specifica, altrimenti vincerebbero
 * per prime nel controllo.
 */
const MODEL_IMAGES = [
    { match: "beta", src: "/bike-beta.jpg" },
    { match: "ducati", src: "/bike-ducati.jpg" },
    { match: "fantic", src: "/bike-fantic.jpg" },
    { match: "honda", src: "/bike-honda.jpg" },
    { match: "husqvarna", src: "/bike-husquarna.jpg" },
    { match: "kawasaki", src: "/bike-kawasaki.jpg" },
    { match: "ktm", src: "/bike-ktm.jpg" },
    { match: "gasgas", src: "/bike-gasgas.jpg" },
    { match: "sherco", src: "/bike-sherco.jpg" },
    { match: "suzuki", src: "/bike-suzuki.jpg" },
    { match: "tm", src: "/bike-tm.jpg" },
    { match: "yamaha", src: "/bike-yamaha.jpg" },
];

const getBikeImage = (bike) => {
    const haystack = `${bike?.brand ?? ""} ${bike?.model ?? ""}`.toLowerCase();
    return MODEL_IMAGES.find(({ match }) => haystack.includes(match))?.src ?? null;
};

export { getBikeImage };
