// src/pages/ForgotPassword/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { api, ApiError } from "../../utils/api";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setSucesso(false);
    setEnviando(true);

    try {
      await api.esqueciSenha(email);
      setSucesso(true);
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
      <section className="auth-page__image">
        <img
          src="/images/login.png"
          alt="Ambiente relacionado à saúde cardiovascular"
        />
      </section>

      <section className="auth-page__content">
        <div className="auth-card">
          <Link to="/login" className="auth-card__back-link">
            <ArrowLeft size={20} />
            Voltar
          </Link>

          <img src="/Natsa_logo.svg" alt="NATSA" className="auth-card__logo" />

          <h1 className="auth-card__title">Recuperar Senha</h1>
          <p className="auth-card__subtitle">
            Informe o e-mail cadastrado e enviaremos um link para você redefinir sua senha.
          </p>

          {erro && (
            <div className="auth-card__alert auth-card__alert--error">
              {erro}
            </div>
          )}
          {sucesso && (
            <div className="auth-card__alert auth-card__alert--success">
              Se este e-mail estiver cadastrado, você receberá um link de redefinição de senha em instantes. (Verifique o terminal do backend)
            </div>
          )}

          {!sucesso && (
            <form onSubmit={handleSubmit} className="auth-card__form">
              <div className="auth-card__input-group">

                <div className="auth-card__input-wrapper">
                  <Mail className="auth-card__input-icon" size={20} />
                  <input
                    id="email"
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-card__submit"
                disabled={enviando}
              >
                {enviando ? "Enviando..." : "Enviar Link"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
