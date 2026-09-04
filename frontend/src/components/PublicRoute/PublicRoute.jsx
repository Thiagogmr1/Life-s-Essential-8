import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PublicRoute({ children }) {
  const { usuario, loading, emTransicaoCadastro } = useAuth();

  if (loading) {
    return null;
  }

  // Se está logado, mas o Cadastro avisou que está no meio da
  // transição de sucesso, segura o redirecionamento — deixa o
  // Cadastro terminar de mostrar o check verde primeiro.
  if (usuario && !emTransicaoCadastro) {
    return <Navigate to="/home" replace />;
  }

  return children;
}