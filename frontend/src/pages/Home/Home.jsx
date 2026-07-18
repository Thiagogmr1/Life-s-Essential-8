// src/pages/Home/Home.jsx
import { useNavigate } from "react-router-dom";
import PulseLine from "../../components/PulseLine/PulseLine";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="home">
      <div className="home__content">
        <span className="home__eyebrow">Baseado na diretriz da American Heart Association</span>
        <h1 className="home__title">Life's Essential 8</h1>
        <PulseLine />
        <p className="home__lead">
          Avalie sua saúde cardiovascular a partir de oito indicadores clínicos
          e comportamentais reconhecidos internacionalmente. O resultado é
          orientativo, não substitui avaliação médica.
        </p>
        <button className="home__cta" onClick={() => navigate("/questionario")}>
          Iniciar avaliação
        </button>
        <p className="home__disclaimer">
          Esta ferramenta não realiza diagnóstico. Consulte um profissional de
          saúde para interpretar seus resultados.
        </p>
      </div>
    </main>
  );
}