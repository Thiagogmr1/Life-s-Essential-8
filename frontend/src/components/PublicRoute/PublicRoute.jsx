// src/components/PublicRoute/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PublicRoute({ children }) {
  const { usuario, loading } = useAuth();

  // Enquanto ainda verificamos se existe sessão ativa, não renderiza nada
  // para evitar "piscar" a tela de login antes de redirecionar para a Home
  if (loading) {
    return null;
  }

  // Se já estiver logado, redireciona diretamente para a Home
  if (usuario) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
