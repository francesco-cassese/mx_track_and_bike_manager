const BASE_URL = 'http://localhost:3000';

const apiFetch = async (endpoint, options = {}) => {

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || `Errore HTTP: ${response.status}`)
    }

    return result.data;

}