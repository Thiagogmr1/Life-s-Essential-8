// src/pages/Login/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../utils/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
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
      navigate("/home");
    } catch (err) {
      const mensagem =
        err instanceof ApiError
          ? err.detail
          : "Erro ao conectar com o servidor";

      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="auth-page">
      {/* Lado esquerdo */}
      <section className="auth-page__image">
        <img
          src="/images/login.png"
          alt="Ambiente relacionado à saúde cardiovascular"
        />
      </section>

      {/* Lado direito */}
      <section className="auth-page__content">
  <div className="auth-card">


  <img
  src="/Natsa_logo.svg"
  alt="NATSA"
  className="auth-card__logo"
/>

  <h1 className="auth-card__title">
    NATSA
  </h1>

  <p className="auth-card__description">
    Conhecer para preservar
  </p>

  {/* <span className="auth-card__badge">
    BASEADO NA DIRETRIZ DA AMERICAN HEART ASSOCIATION
  </span> */}
  
  {erro && (
    <div className="auth-card__error">
      {erro}
    </div>
  )}

  <form onSubmit={handleSubmit}>

      <div className="auth-card__field">
        <label htmlFor="email" className="sr-only">Email</label>
        <div className="auth-card__input-wrapper">
          <Mail size={18} className="auth-card__input-icon" />
          <input
            id="email"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="auth-card__field">
        <label htmlFor="senha" className="sr-only">Senha</label>
        <div className="auth-card__input-wrapper">
          <Lock size={18} className="auth-card__input-icon" />
          <input
            id="senha"
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button
            type="button"
            className="auth-card__toggle-senha"
            onClick={() => setMostrarSenha((v) => !v)}
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="auth-card__submit"
        disabled={enviando}
      >
        {enviando ? "Entrando..." : "Entrar"}
      </button>

    </form>

    <div className="auth-card__divider">
      <span></span>
      <small>ou</small>
      <span></span>
    </div>

    <p className="auth-card__footer">
      Não tem conta?{" "}
      <Link to="/cadastro">
        Criar conta
      </Link>
    </p>

  </div>
</section>
    </main>
  );
}