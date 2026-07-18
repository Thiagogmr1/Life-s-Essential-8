// src/pages/History/History.jsx
import { Link } from "react-router-dom";
import { useAssessment } from "../../context/AssessmentContext";
import "./History.css";

export default function History() {
  const { history } = useAssessment();

  return (
    <div className="history-page">
      <div className="history-card">
        <h1 className="history-card__title">Histórico</h1>

        {history.length === 0 ? (
          <div className="history-card__empty">
            <p>Nenhuma avaliação registrada nesta sessão ainda.</p>
            <Link to="/questionario">Fazer avaliação</Link>
          </div>
        ) : (
          <ul className="history-timeline">
            {[...history].reverse().map((entry) => (
              <li key={entry.id} className="history-timeline__item">
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}