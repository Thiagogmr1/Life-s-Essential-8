// src/components/PrivateRoute/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { usuario, loading } = useAuth();

  // Enquanto ainda não confirmamos com o backend (GET /usuarios/me),
  // não redireciona — evita mandar pro login alguém que na verdade
  // já está autenticado, só porque a resposta ainda não chegou.
  if (loading) {
    return null; // ou um spinner, se preferir
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}