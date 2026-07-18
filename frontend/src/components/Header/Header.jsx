// src/components/Header/Header.jsx
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
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
    </header>
  );
}