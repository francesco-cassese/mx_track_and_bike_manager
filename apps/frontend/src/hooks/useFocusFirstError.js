/**
 * Sposta il focus sul primo campo non valido (in ordine di apparizione nel
 * form), così l'utente da tastiera/screen reader arriva subito dove serve
 * intervenire. Le ref restano create dal chiamante con useRef: qui si
 * condivide solo la logica di ricerca/focus, non la creazione delle ref.
 */
const useFocusFirstError = (fieldRefs, fieldOrder) => {
    const focusFirstError = (errorsToCheck) => {
        const firstInvalidField = fieldOrder.find((field) => errorsToCheck[field]);
        fieldRefs[firstInvalidField]?.current?.focus();
    };

    return { focusFirstError };
};

export { useFocusFirstError };
