// src/components/QuestionCard/QuestionCard.jsx
export default function QuestionCard({
    label,
    children,
    onNext,
    onBack,
    isFirst,
    isLast,
    isValid,
  }) {
    return (
      <section>
        <h2>{label}</h2>
        <div>{children}</div>
        <div>
          {!isFirst && <button type="button" onClick={onBack}>Voltar</button>}
          <button type="button" onClick={onNext} disabled={!isValid}>
            {isLast ? "Finalizar" : "Próximo"}
          </button>
        </div>
      </section>
    );
  }