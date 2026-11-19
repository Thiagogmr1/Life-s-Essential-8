import { LE8_DOMAINS } from "../../data/le8Criteria";
import ScoreBadge from "../../components/ScoreBadge/ScoreBadge";
import DomainBar from "../../components/DomainBar/DomainBar";
import "./Results.css";

export default function ResultView({ result, actions }) {
  return (
    <div className="results-card">
      <h1 className="results-card__title">Resultado</h1>

      <ScoreBadge
        score={result.compositeScore}
        colorToken={result.classification.colorToken}
        classificationLabel={result.classification.label}
      />

      <div className="results-card__breakdown">
        <h2 className="results-card__subtitle">Detalhamento por domínio</h2>
        {LE8_DOMAINS.map((domain) => (
          <DomainBar
            key={domain.id}
            label={domain.label}
            score={result.domainScores[domain.id]}
          />
        ))}
      </div>

      <p className="results-card__disclaimer">
        Este resultado é orientativo e não substitui avaliação médica.
        Consulte um profissional de saúde para interpretação clínica.
      </p>

      <div className="results-card__actions">{actions}</div>
    </div>
  );
}