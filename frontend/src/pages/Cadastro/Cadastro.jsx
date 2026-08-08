// src/pages/Cadastro/Cadastro.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../utils/api";
import "./Cadastro.css";

const REDIRECT_DELAY_MS = 2000;

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await cadastrar({
        nome,
        idade: Number(idade),
        email,
        senha,
      });

      setSucesso(true);

      setTimeout(() => {
        navigate("/questionario");
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      const mensagem =
        err instanceof ApiError
          ? err.detail
          : "Erro ao conectar com o servidor";

      setErro(mensagem);
      setEnviando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {sucesso ? (
          <div className="auth-card__success" role="status" aria-live="polite">
            <svg
              className="auth-card__success-icon"
              viewBox="0 0 52 52"
              aria-hidden="true"
            >
              <circle
                className="auth-card__success-circle"
                cx="26"
                cy="26"
                r="24"
                fill="none"
              />
              <path
                className="auth-card__success-check"
                fill="none"
                d="M14 27l7 7 16-16"
              />
            </svg>
            <p className="auth-card__success-text">Conta criada!</p>
          </div>
        ) : (
          <>
            <h1 className="auth-card__title">Criar conta</h1>

            <form onSubmit={handleSubmit}>
              {erro && (
                <p className="auth-card__error" role="alert">
                  {erro}
                </p>
              )}

              <div className="auth-card__field">
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="auth-card__field">
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
              </div>

              <div className="auth-card__field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-card__field">
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  type="password"
                  minLength={8}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <button
                className="auth-card__submit"
                type="submit"
                disabled={enviando}
              >
                {enviando ? "Criando conta..." : "Criar conta"}
              </button>

              <p className="auth-card__footer">
                Já tem conta? <Link to="/login">Entrar</Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}