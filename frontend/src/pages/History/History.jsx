import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAssessment } from "../../context/AssessmentContext";
import "./History.css";
import { exportHistoryToPdf } from "../../utils/exportPdf";

export default function History() {
  const { history, carregarHistorico, erro } = useAssessment();

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  return (
    <div className="history-page">
      <div className="history-card">
        <div className="history-card__header">
          <h1 className="history-card__title">Histórico</h1>

          {history.length > 0 && (
            <button
              type="button"
              className="history-card__btn-pdf"
              onClick={() => exportHistoryToPdf(history)}
              title="Exportar histórico completo em PDF"
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
          )}
        </div>

        {erro && <p role="alert">{erro}</p>}

        {history.length === 0 ? (
          <div className="history-card__empty">
            <p>Nenhuma avaliação registrada ainda.</p>
            <Link to="/questionario">Fazer avaliação</Link>
          </div>
        ) : (
          <ul className="history-timeline">
            {/* history já vem do mais recente para o mais antigo
                (API ordena por data desc; submitAssessment prepend).
                Sem .reverse() — ele inverteria para a ordem errada. */}
            {history.map((entry) => (
              <li key={entry.id} className="history-timeline__item">
                <Link to={`/historico/${entry.id}`} className="history-timeline__link">
                  <span
                    className="history-timeline__dot"
                    style={{ background: `var(--${entry.classification.colorToken})` }}
                  />
                  <div className="history-timeline__content">
                    <span className="history-timeline__date">
                      {new Date(entry.date).toLocaleDateString("pt-BR")}
                    </span>
                    <span
                      className="history-timeline__score"
                      style={{ color: `var(--${entry.classification.colorToken})` }}
                    >
                      {entry.compositeScore} pontos — {entry.classification.label}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}