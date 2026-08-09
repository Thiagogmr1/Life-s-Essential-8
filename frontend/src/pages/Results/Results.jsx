import { Link, useNavigate } from "react-router-dom";
import { useAssessment } from "../../context/AssessmentContext";
import ResultView from "./ResultView";
import "./Results.css";
import { exportResultToPdf } from "../../utils/exportPdf";

export default function Results() {
  const { result, resetAnswers, enviando } = useAssessment();
  const navigate = useNavigate();

  if (enviando) {
    return (
      <div className="results-page">
        <div className="results-card">
          <p>Calculando resultado...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-page">
        <div className="results-card">
          <p>Nenhuma avaliação encontrada.</p>
          <Link to="/questionario">Fazer avaliação</Link>
        </div>
      </div>
    );
  }

  const handleNewAssessment = () => {
    resetAnswers();
    navigate("/questionario");
  };

  return (
    <div className="results-page">
      <ResultView
        result={result}
        actions={
          <>
            <button className="results-card__secondary" onClick={handleNewAssessment}>
              Nova avaliação
            </button>
            <button className="results-card__secondary" onClick={() => exportResultToPdf(result)}>
              Exportar PDF
            </button>
            <Link to="/historico" className="results-card__primary">
              Ver histórico
            </Link>
          </>
        }
      />
    </div>
  );
}