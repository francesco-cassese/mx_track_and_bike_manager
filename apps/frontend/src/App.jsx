import { Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

/**
 * Definisco le rotte principali dell'app: registrazione, login e un
 * redirect di default alla registrazione finché non esiste una home page.
 */
function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/register" replace />} />
      </Routes>
    </>
  )
}

export default App
