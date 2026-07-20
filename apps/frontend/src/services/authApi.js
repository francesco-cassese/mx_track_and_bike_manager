import { apiFetch } from "./api";

const register = async ({ name, email, password }) => {

    const data = await apiFetch(`/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
    });

    return data;
}

export { register };