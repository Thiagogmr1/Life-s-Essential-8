import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAssessment } from "../../context/AssessmentContext";
import ResultView from "../Results/ResultView";
import { exportResultToPdf } from "../../utils/exportPdf";
import "../Results/Results.css";

export default function HistoryDetail() {
  const { id } = useParams();
  const { history, carregarHistorico, erro } = useAssessment();
  const [carregando, setCarregando] = useState(false);

  // Se o usuário chegar direto nesta URL (refresh, link compartilhado),
  // o history do contexto ainda está vazio — precisamos buscar antes.
  useEffect(() => {
    if (history.length === 0) {
      setCarregando(true);
      carregarHistorico().finally(() => setCarregando(false));
    }
  }, [history.length, carregarHistorico]);

  const entry = history.find((item) => String(item.id) === id);

  if (carregando) {
    return (
      <div className="results-page">
        <div className="results-card">
          <p>Carregando avaliação...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="results-page">
        <div className="results-card">
          <p role="alert">{erro}</p>
          <Link
            to="/historico"
            className="results-card__btn results-card__btn--primary"
          >
            Voltar ao histórico
          </Link>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="results-page">
        <div className="results-card">
          <p>Avaliação não encontrada.</p>
          <Link
            to="/historico"
            className="results-card__btn results-card__btn--primary"
          >
            Voltar ao histórico
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <ResultView
        result={entry}
        actions={
          <>
            <Link
              to="/historico"
              className="results-card__btn results-card__btn--secondary"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Voltar ao histórico</span>
            </Link>

            <button
              type="button"
              className="results-card__btn results-card__btn--pdf"
              onClick={() => exportResultToPdf(entry)}
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
          </>
        }
      />
    </div>
  );
}