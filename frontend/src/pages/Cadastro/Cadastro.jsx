// src/pages/Cadastro/Cadastro.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../utils/api";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await cadastrar({ nome, idade: Number(idade), email, senha });
      navigate("/questionario");
    } catch (err) {
      const mensagem =
        err instanceof ApiError ? err.detail : "Erro ao conectar com o servidor";
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Criar conta</h1>

      {erro && <p role="alert">{erro}</p>}

      <label htmlFor="nome">Nome</label>
      <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />

      <label htmlFor="idade">Idade</label>
      <input
        id="idade"
        type="number"
        min="1"
        max="129"
        value={idade}
        onChange={(e) => setIdade(e.target.value)}
        required
      />

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
        minLength={8}
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />

      <button type="submit" disabled={enviando}>
        {enviando ? "Criando conta..." : "Criar conta"}
      </button>

      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </form>
  );
}