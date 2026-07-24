import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AddBikePage from "./pages/AddBikePage";
import BikeDetailPage from "./pages/BikeDetailPage";
import EditBikePage from "./pages/EditBikePage";
import AddSessionPage from "./pages/AddSessionPage";
import EditSessionPage from "./pages/EditSessionPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Definisco le rotte principali dell'app: registrazione, login, una home
 * protetta (richiede autenticazione) con le rotte per gestire le moto, e
 * una 404 per qualunque altro percorso non riconosciuto.
 */
function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/bikes/new" element={<ProtectedRoute><AddBikePage /></ProtectedRoute>} />
        <Route path="/bikes/:id" element={<ProtectedRoute><BikeDetailPage /></ProtectedRoute>} />
        <Route path="/bikes/:id/edit" element={<ProtectedRoute><EditBikePage /></ProtectedRoute>} />
        <Route path="/bikes/:id/sessions/new" element={<ProtectedRoute><AddSessionPage /></ProtectedRoute>} />
        <Route path="/bikes/:id/sessions/:sessionId/edit" element={<ProtectedRoute><EditSessionPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
