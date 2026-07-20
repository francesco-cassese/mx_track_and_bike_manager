import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <>
            <h1>Pagina non trovata</h1>
            <p><Link to="/register">Torna alla registrazione</Link></p>
        </>
    )
}
export default NotFoundPage
