// src/components/ScoreBadge/ScoreBadge.jsx
import "./ScoreBadge.css";

export default function ScoreBadge({ score, colorToken, classificationLabel }) {
  return (
    <div
      className="score-badge"
      style={{ "--score-color": `var(--${colorToken})` }}
    >
      <div className="score-badge__circle">
        <span className="score-badge__value">{score}</span>
        <span className="score-badge__max">/100</span>
      </div>
      <span className="score-badge__label">Saúde cardiovascular {classificationLabel.toLowerCase()}</span>
    </div>
  );
}