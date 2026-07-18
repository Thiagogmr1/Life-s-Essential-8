// src/components/DomainBar/DomainBar.jsx
import "./DomainBar.css";
import { classifyScore } from "../../utils/scoring";

export default function DomainBar({ label, score }) {
  const { colorToken } = classifyScore(score);

  return (
    <div className="domain-bar">
      <div className="domain-bar__header">
        <span className="domain-bar__label">{label}</span>
        <span className="domain-bar__value" style={{ color: `var(--${colorToken})` }}>
          {score}
        </span>
      </div>
      <div className="domain-bar__track">
        <div
          className="domain-bar__fill"
          style={{ width: `${score}%`, background: `var(--${colorToken})` }}
        />
      </div>
    </div>
  );
}