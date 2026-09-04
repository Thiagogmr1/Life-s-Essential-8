// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // true enquanto ainda não sabemos se existe uma sessão válida —
  // evita "piscar" a tela de login antes de confirmar com o backend
  const [loading, setLoading] = useState(true);

  // true durante a janela entre "conta criada com sucesso" e a
  // navegação manual para /home feita pelo próprio Cadastro.jsx.
  // Existe para impedir que o PublicRoute redirecione o usuário
  // assim que `usuario` deixa de ser null, o que interromperia a
  // tela de sucesso (check verde) antes dela terminar de aparecer.
  const [emTransicaoCadastro, setEmTransicaoCadastro] = useState(false);

  useEffect(() => {
    api
      .obterUsuarioAtual()
      .then((data) => setUsuario(data))
      .catch(() => setUsuario(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, senha) => {
    const data = await api.login({ email, senha });
    setUsuario(data.usuario);
    return data.usuario;
  }, []);

  const cadastrar = useCallback(async (dados) => {
    const data = await api.cadastrar(dados);
    setUsuario(data.usuario);
    return data.usuario;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUsuario(null);
  }, []);

  const value = {
    usuario,
    loading,
    login,
    cadastrar,
    logout,
    emTransicaoCadastro,
    setEmTransicaoCadastro,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return context;
}