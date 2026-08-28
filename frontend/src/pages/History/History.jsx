import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAssessment } from "../../context/AssessmentContext";
import "./History.css";
import { exportHistoryToExcel } from "../../utils/exportExcel";
import { exportHistoryToPdf } from "../../utils/exportPdf";

export default function History() {
  const { history, carregarHistorico, erro } = useAssessment();

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  return (
    <div className="history-page">
      <div className="history-card">
        <h1 className="history-card__title">Histórico</h1>

        {erro && <p role="alert">{erro}</p>}

        {history.length > 0 && (
          <div className="history-card__export-actions">
            <button
              className="history-card__export"
              onClick={() => exportHistoryToExcel(history)}
            >
              Exportar planilha (Excel)
            </button>
            <button
              className="history-card__export"
              onClick={() => exportHistoryToPdf(history)}
            >
              Exportar PDF completo
            </button>
          </div>
        )}

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