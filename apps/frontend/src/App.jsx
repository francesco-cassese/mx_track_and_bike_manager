import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AddBikePage from "./pages/AddBikePage";
import BikeDetailPage from "./pages/BikeDetailPage";
import EditBikePage from "./pages/EditBikePage";
import AddSessionPage from "./pages/AddSessionPage";
import EditSessionPage from "./pages/EditSessionPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RootRoute from "./components/RootRoute";
import PageTransition from "./components/PageTransition";

/**
 * Definisco le rotte principali dell'app: registrazione, login, una radice
 * che mostra la dashboard se autenticati o la landing page pubblica altrimenti,
 * le rotte per gestire le moto (protette), e una 404 per il resto.
 * Utilizziamo AnimatePresence per abilitare le animazioni di uscita sulle rotte.
 */
function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/" element={<PageTransition><RootRoute /></PageTransition>} />
        <Route path="/bikes/new" element={<ProtectedRoute><PageTransition><AddBikePage /></PageTransition></ProtectedRoute>} />
        <Route path="/bikes/:id" element={<ProtectedRoute><PageTransition><BikeDetailPage /></PageTransition></ProtectedRoute>} />
        <Route path="/bikes/:id/edit" element={<ProtectedRoute><PageTransition><EditBikePage /></PageTransition></ProtectedRoute>} />
        <Route path="/bikes/:id/sessions/new" element={<ProtectedRoute><PageTransition><AddSessionPage /></PageTransition></ProtectedRoute>} />
        <Route path="/bikes/:id/sessions/:sessionId/edit" element={<ProtectedRoute><PageTransition><EditSessionPage /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
