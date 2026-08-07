// src/components/Header/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        <img
          src="/assets/logo-unievangelica.png"
          alt="UniEVANGÉLICA — Universidade Evangélica de Goiás"
          className="app-header__logo"
        />
        <span className="app-header__divider" aria-hidden="true" />
        <span className="app-header__title">
          Life&apos;s Essential 8
          <span className="app-header__subtitle">Avaliação de Saúde Cardiovascular</span>
        </span>
      </Link>

      {usuario && (
        <div className="app-header__user">
          <span className="app-header__user-name">Olá, {usuario.nome}</span>
          <button className="app-header__logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      )}
    </header>
  );
}