// src/components/AdminRoute/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { usuario, loading } = useAuth();

  // Mesmo raciocínio do PrivateRoute: enquanto não confirmamos com o
  // backend (GET /usuarios/me), não redireciona — evita "chutar" pra
  // fora alguém que na verdade é admin, só porque a resposta ainda
  // não chegou.
  if (loading) {
    return null;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}