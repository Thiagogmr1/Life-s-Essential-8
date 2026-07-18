// src/components/QuestionCard/QuestionCard.jsx
import "./QuestionCard.css";

export default function QuestionCard({ label, children, onNext, onBack, isFirst, isLast, isValid }) {
  return (
    <div className="question-page">
      <section className="question-card">
        <h2 className="question-card__label">{label}</h2>
        <div className="question-card__body">{children}</div>
        <div className="question-card__actions">
          {!isFirst && (
            <button type="button" className="question-card__back" onClick={onBack}>
              Voltar
            </button>
          )}
          <button
            type="button"
            className="question-card__next"
            onClick={onNext}
            disabled={!isValid}
          >
            {isLast ? "Finalizar" : "Próximo"}
          </button>
        </div>
      </section>
    </div>
  );
}