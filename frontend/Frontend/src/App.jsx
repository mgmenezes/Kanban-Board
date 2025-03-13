import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { KanbanProvider } from "./context/KanbanContext";
import useAuth from "./hooks/useAuth";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import BoardPage from "./pages/BoardPage";
import NewBoardPage from "./pages/NewBoardPage";
import PrivateRoute from "./components/PrivateRoute";

// Importar páginas
import BoardDetails from "./pages/BoardDetails";
import NotFound from "./pages/NotFound";

/**
 * Componente para proteger rotas que requerem autenticação
 * @param {Object} props - Propriedades do componente
 * @param {JSX.Element} props.children - Componente filho a ser renderizado se autenticado
 * @returns {JSX.Element} - Rota protegida ou redirecionamento
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Se ainda estiver carregando, exibir um indicador de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para a página de login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderizar o componente filho
  return children;
};

/**
 * Componente wrapper para aplicar provedores de contexto
 * @param {Object} props - Propriedades do componente
 * @param {JSX.Element} props.children - Componentes filhos
 * @returns {JSX.Element} - Componentes envolvidos pelos provedores
 */
const AppProviders = ({ children }) => (
  <AuthProvider>
    <KanbanProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </KanbanProvider>
  </AuthProvider>
);

/**
 * Componente principal da aplicação com roteamento
 * @returns {JSX.Element} - Componente App
 */
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppProviders>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rotas protegidas */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/boards"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/boards/:boardId"
                element={
                  <PrivateRoute>
                    <BoardDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/board/:id"
                element={
                  <PrivateRoute>
                    <BoardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/board/new"
                element={
                  <PrivateRoute>
                    <NewBoardPage />
                  </PrivateRoute>
                }
              />

              {/* Rota de fallback (404) */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppProviders>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
