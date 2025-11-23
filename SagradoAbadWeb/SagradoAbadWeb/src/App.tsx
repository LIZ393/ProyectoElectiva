import { Route, Routes } from "react-router";
import "./App.css";
import { Dashboard } from "./Dashboard";
import LoginPage from "./LoginPage";

import ProtectedRoute from "./components/AuhtorizationComponent";
import CategoriasManagement from "./components/CategoriasManagement";
import OrdenesManagement from "./components/OrdenesManagement";
import NoAutorizado from "./NoAutorizado";

function App() {
  return (
    
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/no-autorizado" element={<NoAutorizado />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/productos" element={<Dashboard />} />
        <Route path="/categorias" element={<CategoriasManagement />} />
        <Route path="/ordenes" element={<OrdenesManagement />} />
        
      </Route>
    </Routes>
  );
}

export default App;
