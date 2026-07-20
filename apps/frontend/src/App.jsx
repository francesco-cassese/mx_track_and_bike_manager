import { Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

/**
 * Definisco le rotte principali dell'app: registrazione, login, un
 * redirect di default alla registrazione finché non esiste una home page,
 * e una 404 per qualunque altro percorso non riconosciuto.
 */
function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
