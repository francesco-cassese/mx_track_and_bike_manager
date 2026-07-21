import { useAuth } from "../hooks/useAuth";

function HomePage() {
    const { logout } = useAuth();

    return (
        <>
            <h1>Dashboard</h1>
            <p>Accesso effettuato con successo.</p>
            <button type="button" onClick={logout}>Esci</button>
        </>
    )
}
export default HomePage
