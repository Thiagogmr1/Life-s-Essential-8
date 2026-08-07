// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // true enquanto ainda não sabemos se existe uma sessão válida —
  // evita "piscar" a tela de login antes de confirmar com o backend
  const [loading, setLoading] = useState(true);

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

  const value = { usuario, loading, login, cadastrar, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return context;
}