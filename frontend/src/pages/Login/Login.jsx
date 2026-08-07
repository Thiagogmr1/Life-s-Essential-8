// src/pages/Login/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await login(email, senha);
      navigate("/questionario");
    } catch (err) {
      // Backend sempre devolve a mesma mensagem genérica para email
      // inexistente ou senha errada (ver auth.py) — não tentamos
      // diferenciar isso aqui, propositalmente.
      const mensagem =
        err instanceof ApiError ? err.detail : "Erro ao conectar com o servidor";
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Entrar</h1>

      {erro && <p role="alert">{erro}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="senha">Senha</label>
      <input
        id="senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />

      <button type="submit" disabled={enviando}>
        {enviando ? "Entrando..." : "Entrar"}
      </button>

      <p>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </form>
  );
}