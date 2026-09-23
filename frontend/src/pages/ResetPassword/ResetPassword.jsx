// src/pages/ResetPassword/ResetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { api, ApiError } from "../../utils/api";
import "./ResetPassword.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setEnviando(true);

    try {
      await api.redefinirSenha(token, novaSenha);
      setSucesso(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
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
          <img src="/Natsa_logo.svg" alt="NATSA" className="auth-card__logo" />

          <h1 className="auth-card__title">Nova Senha</h1>
          <p className="auth-card__subtitle">
            Digite sua nova senha abaixo.
          </p>

          {erro && (
            <div className="auth-card__alert auth-card__alert--error">
              {erro}
            </div>
          )}
          {sucesso && (
            <div className="auth-card__alert auth-card__alert--success">
              Senha redefinida com sucesso! Redirecionando para o login...
            </div>
          )}

          {!sucesso && (
            <form onSubmit={handleSubmit} className="auth-card__form">
              <div className="auth-card__input-group">
                <label htmlFor="novaSenha">Nova Senha</label>
                <div className="auth-card__input-wrapper">
                  <Lock className="auth-card__input-icon" size={20} />
                  <input
                    id="novaSenha"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-card__toggle-senha"
                    onClick={() => setMostrarSenha((v) => !v)}
                  >
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-card__input-group">
                <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
                <div className="auth-card__input-wrapper">
                  <Lock className="auth-card__input-icon" size={20} />
                  <input
                    id="confirmarSenha"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Repita a nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-card__submit"
                disabled={enviando}
              >
                {enviando ? "Salvando..." : "Salvar Nova Senha"}
              </button>
            </form>
          )}

          <div className="auth-card__footer">
            <Link to="/login">Voltar para o Login</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
