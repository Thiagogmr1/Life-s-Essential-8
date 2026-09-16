
// src/pages/Home/Home.jsx
import { useNavigate } from "react-router-dom";
import PulseLine from "../../components/PulseLine/PulseLine";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="home">
      <div className="home__content">

          <img
            src="/Natsa_logo.png"
            alt="NATSA"
            className="auth-card__logo"
          />
        {/* <span className="home__eyebrow">
          Baseado na diretriz da American Heart Association
        </span> */}

        <h1 className="home__title">NATSA</h1>

        <PulseLine />

        <p className="home__lead">
          Este teste é baseado no Life’s Essential 8™, da American Heart Association, que reúne indicadores de saúde cardiovascular.
        </p>

        <div className="home__actions">
          <button
            className="home__cta"
            onClick={() => navigate("/questionario")}
          >
            Iniciar avaliação
          </button>

          <button
            className="home__history"
            onClick={() => navigate("/historico")}
          >
            Ver histórico
          </button>
        </div>

        <p className="home__disclaimer">
          O resultado oferece uma referência sobre sua saúde cardiovascular e deve ser interpretado 
          em conjunto com a avaliação de um profissional de saúde
        </p>
      </div>
    </main>
  );
}
