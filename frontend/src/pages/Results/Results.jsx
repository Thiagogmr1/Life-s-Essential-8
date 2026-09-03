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
          <Link
            to="/questionario"
            className="results-card__btn results-card__btn--primary"
          >
            Fazer avaliação
          </Link>
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
            <button
              type="button"
              className="results-card__btn results-card__btn--secondary"
              onClick={handleNewAssessment}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>Nova avaliação</span>
            </button>

            <button
              type="button"
              className="results-card__btn results-card__btn--pdf"
              onClick={() => exportResultToPdf(result)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Exportar PDF</span>
            </button>

            <Link
              to="/historico"
              className="results-card__btn results-card__btn--primary"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Ver histórico</span>
            </Link>
          </>
        }
      />
    </div>
  );
}